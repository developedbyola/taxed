import { z } from 'zod';
import argon2 from 'argon2';
import { auth } from '../../utils/auth';
import { publicProcedure, router } from '../middleware';

// Strong password validation schema
const passwordSchema = z
  .string()
  .min(8, 'Your password should be at least 8 characters long')
  .regex(/[A-Z]/, 'Include at least one uppercase letter (A-Z)')
  .regex(/[a-z]/, 'Include at least one lowercase letter (a-z)')
  .regex(/[0-9]/, 'Include at least one number (0-9)')
  .regex(/[^A-Za-z0-9]/, 'Include at least one special character (!@#$%^&*)')
  .regex(/^\S+$/, 'Password cannot contain spaces');

export const authRouter = router({
  login: publicProcedure
    .input(
      z.object({
        password: passwordSchema,
        email: z.string().email('Please enter a valid email address'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;

      try {
        // Get user from database
        const user = await ctx.supabase
          .from('users')
          .select('id, created_at, first_name, last_name, email, password')
          .eq('email', email)
          .single();

        if (user.error) {
          return ctx.fail({
            code: 'UNAUTHORIZED',
            message:
              'The email you entered is incorrect. Please check your credentials and try again.',
          });
        }

        // Check if user exists
        if (!user.data) {
          return ctx.fail({
            code: 'UNAUTHORIZED',
            message:
              'The email you entered is incorrect. Please check your credentials and try again.',
          });
        }

        // Check if password is valid
        const isPasswordValid = await argon2.verify(
          user.data.password,
          password
        );

        // Check if password is valid
        if (!isPasswordValid) {
          return ctx.fail({
            code: 'UNAUTHORIZED',
            message:
              "The password you entered is incorrect. Please try again or reset your password if you've forgotten it.",
          });
        }

        // Get session data
        const {
          deviceName,
          deviceType,
          osVersion,
          appVersion,
          ipAddress,
          fingerprint,
          expiresAt,
        } = await auth.session(ctx.honoContext);

        // Create session
        const session = await ctx.supabase
          .from('user_sessions')
          .upsert(
            {
              fingerprint,
              is_active: true,
              os_version: osVersion,
              user_id: user.data.id,
              ip_address: ipAddress,
              expires_at: expiresAt,
              device_name: deviceName,
              device_type: deviceType,
              app_version: appVersion,
            },
            { onConflict: 'fingerprint' }
          )
          .select('id')
          .single();

        // Check if session was created
        if (!session.data) {
          return ctx.fail({
            code: 'INTERNAL_SERVER_ERROR',
            message: `We encountered an unexpected error while setting up your session. ${session.error.message}`,
          });
        }

        // Get user data
        const userData = {
          id: user.data.id,
          firstName: user.data.first_name,
          lastName: user.data.last_name,
          email: user.data.email,
          createdAt: user.data.created_at,
        };

        // Sign access token
        const accessToken = await auth.jwt.sign({
          type: 'access',
          payload: {
            userId: userData.id,
            sessionId: session.data.id,
          },
        });

        // Sign refresh token
        const refreshToken = await auth.jwt.sign({
          type: 'refresh',
          payload: {
            userId: userData.id,
            sessionId: session.data.id,
          },
        });

        // Return access token and user data
        return ctx.ok(
          { accessToken, refreshToken, user: userData },
          { httpStatus: 200, path: 'auth.login' }
        );
      } catch (err) {
        console.log(err);
        return ctx.fail(err);
      }
    }),

  register: publicProcedure
    .input(
      z.object({
        firstName: z
          .string()
          .min(2, 'Please enter your full name (at least 2 characters)'),
        lastName: z
          .string()
          .min(2, 'Please enter your full name (at least 2 characters)'),
        email: z.string().email('Please enter a valid email address'),
        password: passwordSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { firstName, lastName, email, password } = input;

      try {
        const previousUser = await ctx.supabase
          .from('users')
          .select('id, created_at, first_name, last_name, email')
          .eq('email', email)
          .single();

        if (previousUser.data) {
          return ctx.fail({
            code: 'CONFLICT',
            message:
              'An account with this email already exists. Please use a different email or try logging in instead.',
          });
        }

        const hashedPassword = await argon2.hash(password);

        const user = await ctx.supabase
          .from('users')
          .insert({
            first_name: firstName,
            last_name: lastName,
            email,
            password: hashedPassword,
          })
          .select('id, created_at, first_name, last_name, email')
          .single();

        if (user.error) {
          return ctx.fail({
            code: 'INTERNAL_SERVER_ERROR',
            message: `We encountered an issue creating your account. ${user.error.message}`,
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
          { httpStatus: 200, path: 'auth.register' }
        );
      } catch (err) {
        return ctx.fail(err);
      }
    }),

  refresh: publicProcedure
    .input(
      z.object({
        refreshToken: z.string().min(1, 'Your refresh token is missing'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const refreshToken = input.refreshToken;

        // Verify the refresh token
        const { userId, sessionId } = (await auth.jwt.verify(
          'refresh',
          refreshToken
        )) as any;

        const session = await ctx.supabase
          .from('user_sessions')
          .select('*')
          .eq('id', sessionId)
          .eq('user_id', userId)
          .eq('is_active', true)
          .single();

        if (session.error) {
          return ctx.fail({
            code: 'BAD_REQUEST',
            message:
              'Failed to reach out to server. Ensure you are connected to the network, then try again later.',
          });
        }

        const isSessionNotFound = !session.data;
        const isSessionInactive = !session.data?.is_active;
        const isSessionExpired = session.data?.expires_at < Date.now();

        if (isSessionNotFound || isSessionInactive || isSessionExpired) {
          return ctx.fail({
            code: 'UNAUTHORIZED',
            message: 'Your session has expired. Please log in again.',
          });
        }

        // Create a new access token
        const accessToken = await auth.jwt.sign({
          type: 'access',
          payload: {
            userId,
            sessionId,
          },
        });

        return ctx.ok(
          { accessToken, refreshToken },
          { httpStatus: 200, path: 'auth.refresh' }
        );
      } catch (err) {
        return ctx.fail(err);
      }
    }),

  logout: publicProcedure
    .input(
      z.object({
        refreshToken: z.string().min(1, ''),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const refreshToken = input.refreshToken;
        const actor = await auth.jwt.verify('refresh', refreshToken);

        const session = await ctx.supabase
          .from('user_sessions')
          .update({ is_active: false })
          .eq('id', actor.sessionId)
          .eq('user_id', actor.userId)
          .select('*')
          .single();

        if (!session.data) {
          return ctx.fail({
            code: 'UNAUTHORIZED',
            message: 'Your session has expired. Please log in again.',
          });
        }

        return ctx.ok(
          { success: true },
          { httpStatus: 200, path: 'auth.logout' }
        );
      } catch (err) {
        console.log(err);
        return ctx.fail(err);
      }
    }),
});
