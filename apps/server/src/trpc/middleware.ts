import { ZodError } from 'zod';
import { auth } from '@/utils/auth';
import type { Context } from '@/trpc/context';
import { initTRPC, TRPCError } from '@trpc/server';
import { getFirstValidationMessage } from '@/utils/validationMessage';

const t = initTRPC.context<Context>().create({
  errorFormatter: (opts) => {
    const { shape, error } = opts;
    return {
      ...shape,
      message:
        error.cause instanceof ZodError
          ? getFirstValidationMessage(error)
          : error.message,
      data: {
        ...shape.data,
        code: shape.data.code,
        path: shape.data.path,
      },
    };
  },
});

const isAuthed = t.middleware(async ({ ctx, next }) => {
  const authorization = ctx.req.header('Authorization');
  const accessToken = authorization?.split('Bearer ')[1];

  let actor = null;
  try {
    if (accessToken) {
      actor = await auth.jwt.verify('access', accessToken);
    }
  } catch (error) {
    // Token verification failed
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid or expired token.',
    });
  }

  if (!actor) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this feature.',
    });
  }

  return next({
    ctx: {
      ...ctx,
      actor,
    },
  });
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
