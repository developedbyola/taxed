import { router } from '@/trpc/middleware';
import { authRouter } from '@/trpc/routers/auth';
import { usersRouter } from '@/trpc/routers/users';
import { systemRouter } from '@/trpc/routers/system';
import { transactionsRouter } from '@/trpc/routers/transactions';
import { sessionsRouter } from '@/trpc/routers/sessions';

export const appRouter = router({
  auth: authRouter,
  users: usersRouter,
  system: systemRouter,
  sessions: sessionsRouter,
  transactions: transactionsRouter,
});

export type AppRouter = typeof appRouter;
