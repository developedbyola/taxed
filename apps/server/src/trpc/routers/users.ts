import { z } from 'zod';
import argon2 from 'argon2';
import { protectedProcedure, publicProcedure, router } from '../middleware';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
  .regex(/^\S+$/, 'Password must not contain any spaces');

export const usersRouter = router({
  profile: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await ctx.supabase
        .from('users')
        .select('id, created_at, first_name, last_name, email')
        .eq('id', ctx.actor.userId)
        .single();

      if (!user.data) {
        return ctx.fail({
          code: 'NOT_FOUND',
          message:
            'Your account could not be found. Please try logging in again or contact support if the issue persists.',
        });
      }

      return ctx.ok(
        {
          user: {
            id: user.data.id,
            firstName: user.data.first_name,
            lastName: user.data.last_name,
            email: user.data.email,
            createdAt: user.data.created_at,
          },
        },
        { httpStatus: 200, path: 'users.profile' }
      );
    } catch (err) {
      return ctx.fail(err);
    }
  }),

  getById: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1, 'User ID is required'),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const user = await ctx.supabase
          .from('users')
          .select('id, first_name, last_name, email, created_at')
          .eq('id', input.userId)
          .single();

        if (!user.data) {
          return ctx.fail({
            message:
              'The requested user account could not be found. The ID provided may be incorrect or the account may have been deleted.',
            code: 'NOT_FOUND',
          });
        }

        return ctx.ok({
          user: user.data,
        });
      } catch (err) {}
    }),

  update: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(2, 'Name must be at least 2 characters long')
          .max(100, 'Name cannot exceed 100 characters')
          .regex(
            /^[\p{L}\s'-]+$/u,
            'Name can only contain letters, spaces, hyphens, and apostrophes'
          )
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const user = await ctx.supabase
          .from('users')
          .update({ first_name: input.name })
          .eq('id', ctx.actor.userId)
          .select('id, first_name, last_name, email, created_at')
          .single();

        if (!user.data) {
          return ctx.fail({
            message:
              'We encountered an issue while updating your profile. Please try again in a few moments.',
            code: 'INTERNAL_SERVER_ERROR',
          });
        }

        return ctx.ok({
          user: user.data,
        });
      } catch (err) {
        return ctx.fail(err);
      }
    }),

  changePassword: protectedProcedure
    .input(
      z.object({
        newPassword: passwordSchema,
        currentPassword: z.string().min(3, 'Current password is required'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const user = await ctx.supabase
          .from('users')
          .select('password')
          .eq('id', ctx.actor.userId)
          .single();

        if (!user.data) {
          return ctx.fail({
            message:
              'The requested user account could not be found. The ID provided may be incorrect or the account may have been deleted.',
            code: 'NOT_FOUND',
          });
        }

        const isSamePassword = await argon2.verify(
          user.data.password,
          input.currentPassword
        );

        if (!isSamePassword) {
          return ctx.fail({
            message: 'The password you entered is incorrect. Please try again.',
            code: 'UNAUTHORIZED',
          });
        }

        const hashedPassword = await argon2.hash(input.newPassword);

        // Update password using Supabase Auth
        const updatedUser = await ctx.supabase
          .from('users')
          .update({
            password: hashedPassword,
          })
          .eq('id', ctx.actor.userId)
          .select('id, name, created_at')
          .single();

        if (updatedUser.error) {
          console.error('Password update error:', updatedUser.error);
          return ctx.fail({
            message:
              'We encountered an issue while updating your password. Please try again later.',
            code: 'INTERNAL_SERVER_ERROR',
          });
        }

        return ctx.ok({
          success: true,
        });
      } catch (err) {
        return ctx.fail(err);
      }
    }),

  changeEmail: protectedProcedure
    .input(
      z.object({
        email: z.string().email('Please enter a valid email address'),
        password: z
          .string()
          .min(3, 'Password is required to confirm this change'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Verify password first
        const user = await ctx.supabase
          .from('users')
          .select('password')
          .eq('id', ctx.actor.userId)
          .single();

        if (!user.data) {
          return ctx.fail({
            message:
              'The requested user account could not be found. The ID provided may be incorrect or the account may have been deleted.',
            code: 'NOT_FOUND',
          });
        }

        const isSamePassword = await argon2.verify(
          user.data.password,
          input.password
        );

        if (!isSamePassword) {
          return ctx.fail({
            message: 'The password you entered is incorrect. Please try again.',
            code: 'UNAUTHORIZED',
          });
        }

        // Check if email is already in use by another account
        const existingUser = await ctx.supabase
          .from('users')
          .select('id')
          .eq('email', input.email)
          .neq('id', ctx.actor.userId)
          .single();

        if (existingUser.data) {
          return ctx.fail({
            message:
              'This email address is already associated with another account. Please use a different email address.',
            code: 'CONFLICT',
          });
        }

        // Update email using Supabase Auth
        const { error: updateError } = await ctx.supabase
          .from('users')
          .update({
            email: input.email,
          })
          .eq('id', ctx.actor.userId)
          .select('id, name, created_at')
          .single();

        if (updateError) {
          console.error('Email update error:', updateError);
          return ctx.fail({
            message:
              'We encountered an issue while updating your email address. Please try again later.',
            code: 'INTERNAL_SERVER_ERROR',
          });
        }

        return ctx.ok({
          success: true,
        });
      } catch (err) {
        return ctx.fail(err);
      }
    }),
});
