import { router } from '@/trpc/middleware';
import { authRouter } from '@/trpc/routers/auth';
import { usersRouter } from '@/trpc/routers/users';
import { systemRouter } from '@/trpc/routers/system';
import { transactionsRouter } from '@/trpc/routers/transactions';

export const appRouter = router({
  auth: authRouter,
  users: usersRouter,
  system: systemRouter,
  transactions: transactionsRouter,
});

export type AppRouter = typeof appRouter;
