import { z } from 'zod';
import { protectedProcedure, router } from '../middleware';

export const sessionsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const sessions = await ctx.supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', ctx.actor.userId)
        .order('created_at', { ascending: false });

      if (sessions.error) {
        return ctx.fail({
          code: 'INTERNAL_SERVER_ERROR',
          message: `We encountered an unexpected error while fetching your sessions. ${sessions.error.message}`,
        });
      }

      return ctx.ok(
        {
          sessions:
            sessions.data?.map((session) => ({
              id: session.id,
              userId: session.user_id,
              revoked: session.revoked,
              userAgent: session.user_agent,
              ipAddress: session.ip_address,
              createdAt: session.created_at,
              lastActiveAt: session.last_active_at,
              isCurrent: session.id === ctx.actor.sessionId,
            })) || [],
        },
        { httpStatus: 200, path: 'auth.sessions' }
      );
    } catch (err) {
      return ctx.fail(err);
    }
  }),

  current: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const session = await ctx.supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', ctx.actor.userId)
        .eq('id', ctx.actor.sessionId)
        .single();

      if (session.error) {
        return ctx.fail({
          code: 'INTERNAL_SERVER_ERROR',
          message: `We encountered an unexpected error while fetching your current session. ${session.error.message}`,
        });
      }

      return ctx.ok(
        {
          session: {
            isCurrent: true,
            id: session.data.id,
            revoked: session.data.revoked,
            userId: session.data.user_id,
            userAgent: session.data.user_agent,
            ipAddress: session.data.ip_address,
            createdAt: session.data.created_at,
            lastActiveAt: session.data.last_active_at,
          },
        },
        { httpStatus: 200, path: 'auth.currentSession' }
      );
    } catch (err) {
      return ctx.fail(err);
    }
  }),

  revoke: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const session = await ctx.supabase
          .from('user_sessions')
          .update({ revoked: true })
          .eq('id', input.sessionId)
          .eq('user_id', ctx.actor.userId);

        if (session.error) {
          return ctx.fail({
            code: 'INTERNAL_SERVER_ERROR',
            message: session.error.message,
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
