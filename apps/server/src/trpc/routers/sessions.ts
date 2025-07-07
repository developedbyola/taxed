import { z } from 'zod';
import { protectedProcedure, router } from '../middleware';

export const sessionsRouter = router({
  sessions: protectedProcedure.query(async ({ ctx }) => {
    try {
      const sessions = await ctx.supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', ctx.actor.userId)
        .order('created_at', { ascending: false });

      return ctx.ok(
        {
          sessions: sessions.data,
        },
        { httpStatus: 200, path: 'auth.sessions' }
      );
    } catch (err) {
      return ctx.fail(err);
    }
  }),

  revokeSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const session = await ctx.supabase
          .from('user_sessions')
          .update({ is_active: false })
          .eq('id', input.sessionId)
          .eq('user_id', ctx.actor.userId)
          .select('*')
          .single();

        if (!session.data) {
          return ctx.fail({
            code: 'INTERNAL_SERVER_ERROR',
            message:
              'We encountered an issue while revoking your session. Please try again later.',
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
