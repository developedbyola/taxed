import { z } from 'zod';
import argon2 from 'argon2';
import { auth } from '../../utils/auth';
import { env } from '@/configs/env';
import { getConnInfo } from 'hono/bun';
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
            first_name: firstName.toLowerCase(),
            last_name: lastName.toLowerCase(),
            email: email.toLowerCase(),
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
        const user = await ctx.supabase
          .from('users')
          .select('id, created_at, first_name, last_name, email, password')
          .eq('email', email.trim().toLowerCase())
          .single();

        if (user.error) {
          return ctx.fail({
            code: 'UNAUTHORIZED',
            message:
              'The email you entered is incorrect. Please check your credentials and try again.',
          });
        }

        const isPasswordValid = await argon2.verify(
          user.data.password,
          password
        );
        if (!isPasswordValid) {
          return ctx.fail({
            code: 'UNAUTHORIZED',
            message:
              "The password you entered is incorrect. Please try again or reset your password if you've forgotten it.",
          });
        }

        const sessions = await ctx.supabase
          .from('user_sessions')
          .select('*')
          .eq('user_id', user.data.id);

        if (sessions.error) {
          return ctx.fail({
            code: 'INTERNAL_SERVER_ERROR',
            message: `We encountered an unexpected error while setting up your session. ${sessions.error.message}`,
          });
        }

        if (sessions.data.length > Number(env.MAX_SESSIONS)) {
          await ctx.supabase
            .from('user_sessions')
            .delete()
            .eq('id', sessions.data[0].id);
        }

        const info = getConnInfo(ctx.honoContext);

        const session = await ctx.supabase
          .from('user_sessions')
          .upsert(
            {
              user_id: user.data.id,
              ip_address: info.remote.address || 'unknown',
              user_agent: ctx.req.header('user-agent') || 'unknown',
            },
            { onConflict: 'user_agent' }
          )
          .select('id')
          .single();

        if (session.error) {
          return ctx.fail({
            code: 'INTERNAL_SERVER_ERROR',
            message: `We encountered an unexpected error while setting up your session. ${session.error.message}`,
          });
        }

        // Sign access token
        const accessToken = await auth.jwt.sign({
          type: 'access',
          payload: {
            userId: user.data.id,
            sessionId: session.data.id,
          },
        });

        // Sign refresh token
        const refreshToken = await auth.jwt.sign({
          type: 'refresh',
          payload: {
            userId: user.data.id,
            sessionId: session.data.id,
          },
        });

        // Update the session with the refresh token
        const updatedSession = await ctx.supabase
          .from('user_sessions')
          .update({
            refresh_token: await argon2.hash(refreshToken),
          })
          .eq('id', session.data.id)
          .select()
          .single();

        if (updatedSession.error) {
          return ctx.fail({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to store refresh token in session. ${updatedSession.error.message}`,
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

        // Return access token and user data
        return ctx.ok(
          {
            accessToken,
            refreshToken,
            user: userData,
          },
          { httpStatus: 200, path: 'auth.login' }
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
          .update({ last_active_at: new Date().toISOString() })
          .eq('id', sessionId)
          .eq('user_id', userId)
          .select('*')
          .single();

        if (session.error) {
          return ctx.fail({
            code: 'INTERNAL_SERVER_ERROR',
            message: session.error.message,
          });
        }

        const isRefreshTokenValid = await argon2.verify(
          session.data.refresh_token,
          refreshToken
        );

        if (!isRefreshTokenValid) {
          return ctx.fail({
            code: 'UNAUTHORIZED',
            message: 'Invalid refresh token',
          });
        }

        // Create a new access token
        const accessToken = await auth.jwt.sign({
          type: 'access',
          payload: {
            sessionId: session.data.id,
            userId: session.data.user_id,
          },
        });

        const newRefreshToken = await auth.jwt.sign({
          type: 'refresh',
          payload: {
            sessionId: session.data.id,
            userId: session.data.user_id,
          },
        });

        const updatedSession = await ctx.supabase
          .from('user_sessions')
          .update({
            refresh_token: await argon2.hash(newRefreshToken),
            last_active_at: new Date().toISOString(),
          })
          .eq('id', sessionId)
          .eq('user_id', userId)
          .select('*')
          .single();

        if (updatedSession.error) {
          return ctx.fail({
            code: 'INTERNAL_SERVER_ERROR',
            message: updatedSession.error.message,
          });
        }

        return ctx.ok(
          { accessToken, refreshToken: newRefreshToken },
          { httpStatus: 200, path: 'auth.refresh' }
        );
      } catch (err) {
        return ctx.fail({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Your session has expired. Please log in again. ${
            (err as any).message
          }`,
        });
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
        const { userId, sessionId } = await auth.jwt.verify(
          'refresh',
          refreshToken
        );

        const session = await ctx.supabase
          .from('user_sessions')
          .select('*')
          .eq('id', sessionId)
          .eq('user_id', userId)
          .single();

        if (session.error) {
          return ctx.fail({
            code: 'INTERNAL_SERVER_ERROR',
            message: session.error.message,
          });
        }

        const isRefreshTokenValid = await argon2.verify(
          session.data.refresh_token,
          refreshToken
        );

        if (!isRefreshTokenValid) {
          return ctx.fail({
            code: 'UNAUTHORIZED',
            message: 'Invalid refresh token',
          });
        }

        const deletedSession = await ctx.supabase
          .from('user_sessions')
          .delete()
          .eq('id', sessionId)
          .eq('user_id', userId);

        if (deletedSession.error) {
          return ctx.fail({
            code: 'INTERNAL_SERVER_ERROR',
            message: deletedSession.error.message,
          });
        }

        return ctx.ok(
          { success: true },
          { httpStatus: 200, path: 'auth.logout' }
        );
      } catch (err) {
        return ctx.fail({
          code: 'INTERNAL_SERVER_ERROR',
          message: `We encountered an issue while logging you out. ${
            (err as any).message
          }`,
        });
      }
    }),
});
