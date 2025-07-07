import { TRPCError } from '@trpc/server';

type SuccessResponse<T extends object> = T & {
  meta?: {
    timestamp?: string;
    [key: string]: unknown;
  };
};

type ErrorResponse = {
  error: TRPCError;
};

export function createResponse() {
  return {
    success<T extends object>(
      data: T,
      meta?: Record<string, unknown>
    ): SuccessResponse<T> {
      return {
        ...data,
        meta: {
          timestamp: new Date().toISOString(),
          ...meta,
        },
      };
    },
    error(err: unknown): ErrorResponse {
      throw new TRPCError({
        message: (err as any)?.message || 'Something went wrong',
        code: (err as any)?.code || 'INTERNAL_SERVER_ERROR',
        cause: (err as any)?.cause,
      });
    },
  };
}
