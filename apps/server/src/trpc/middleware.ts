import jwt from '@/utils/jwt';
import { ZodError } from 'zod';
import { env } from '@/configs/env';
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

  try {
    let actor = null;
    if (accessToken) {
      actor = await jwt.verify<{ userId: string; sessionId: string }>(
        env.ACCESS_TOKEN_SECRET,
        accessToken
      );
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
  } catch (err) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message:
        'We are unable to complete this request at the moment. Please try again later.',
    });
  }
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
