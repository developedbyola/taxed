import { protectedProcedure, router } from '../middleware';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import {
  querySchema,
  SupabaseQueryBuilder,
} from '@/utils/supabaseQueryBuilder';

export const transactionsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        amount: z.number({
          required_error: 'Amount is required',
          invalid_type_error: 'Amount must be a number',
        }),
        companyCode: z.string({
          required_error: 'Company code is required',
          invalid_type_error: 'Company code must be a string',
        }),
        meta: z.object({
          title: z.string({
            required_error: 'Title is required',
            invalid_type_error: 'Title must be a string',
          }),
          description: z.string({
            required_error: 'Description is required',
            invalid_type_error: 'Description must be a string',
          }),
          logo: z
            .string({
              required_error: 'Logo URL is required',
              invalid_type_error: 'Logo must be a valid URL string',
            })
            .url('Please provide a valid URL for the logo'),
        }),
        customer: z.object({
          email: z
            .string({
              required_error: 'Customer email is required',
              invalid_type_error: 'Email must be a string',
            })
            .email('Please provide a valid email address'),
          phone_number: z.string({
            required_error: 'Phone number is required',
            invalid_type_error: 'Phone number must be a string',
          }),
          name: z.string({
            required_error: 'Customer name is required',
            invalid_type_error: 'Name must be a string',
          }),
        }),
        flwRef: z.string({
          required_error: 'Flutterwave reference is required',
          invalid_type_error: 'Flutterwave reference must be a string',
        }),
        txRef: z.string({
          required_error: 'Transaction reference is required',
          invalid_type_error: 'Transaction reference must be a string',
        }),
        txId: z.number({
          required_error: 'Transaction ID is required',
          invalid_type_error: 'Transaction ID must be a number',
        }),
        currency: z.string({
          required_error: 'Currency is required',
          invalid_type_error: 'Currency must be a string',
        }),
        status: z.string({
          required_error: 'Status is required',
          invalid_type_error: 'Status must be a string',
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { data: transaction, error: insertError } = await ctx.supabase
          .from('user_transactions')
          .insert({
            amount: input.amount,
            flw_ref: input.flwRef,
            tx_ref: input.txRef,
            tx_id: input.txId,
            currency: input.currency,
            customer: input.customer,
            meta: input.meta,
            company_code: input.companyCode,
            user_id: ctx.actor.userId,
            status: input.status,
          })
          .select('*')
          .single();

        if (insertError) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to create transaction: ${insertError.message}`,
          });
        }

        return ctx.ok({
          transaction,
        });
      } catch (error: any) {
        return ctx.fail({
          message: error.message,
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),

  get: protectedProcedure
    .input(querySchema.partial())
    .query(async ({ ctx, input }) => {
      try {
        const queryBuilder = new SupabaseQueryBuilder(ctx.supabase);

        const { data: transactions } = await queryBuilder.query({
          select: '*',
          table: 'user_transactions',
          equal: ['user_id', ctx.actor.userId],
          ...input,
        });

        return ctx.ok({
          transactions,
        });
      } catch (error: any) {
        return ctx.fail({
          message: error.message,
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),

  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { data: transaction, error } = await ctx.supabase
          .from('user_transactions')
          .select('*')
          .eq('id', input.id)
          .eq('user_id', ctx.actor.userId)
          .single();

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to get transaction: ${error.message}`,
          });
        }

        return ctx.ok({
          transaction,
        });
      } catch (error: any) {
        return ctx.fail({
          message: error.message,
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
});
