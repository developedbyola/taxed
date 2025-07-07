// lib/supabase-query-builder.ts
import { z } from 'zod';
import { SupabaseClient } from '@supabase/supabase-js';

// Zod Schemas for validation
export const querySchema = z.object({
  table: z.string(),
  filters: z
    .array(
      z.object({
        field: z.string(),
        operator: z.enum([
          'eq',
          'neq',
          'gt',
          'gte',
          'lt',
          'lte',
          'like',
          'ilike',
          'in',
          'is',
          'cs',
          'cd',
        ]),
        value: z.union([z.string(), z.number(), z.boolean(), z.array(z.any())]),
      })
    )
    .optional(),
  sort: z
    .object({
      field: z.string(),
      direction: z.enum(['asc', 'desc']),
    })
    .optional(),
  pagination: z
    .union([
      z.object({
        type: z.literal('offset'),
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(10),
      }),
      z.object({
        type: z.literal('cursor'),
        cursor: z.union([z.string(), z.number()]).optional(),
        limit: z.number().min(1).max(100).default(10),
        direction: z.enum(['forward', 'backward']).default('forward'),
        cursorField: z.string().default('id'),
      }),
    ])
    .optional(),
  search: z
    .object({
      term: z.string(),
      fields: z.array(z.string()),
    })
    .optional(),
  select: z.string().default('*'),
  count: z.enum(['exact', 'planned', 'estimated']).optional(),
});

export type QueryOptions = z.infer<typeof querySchema>;

export class SupabaseQueryBuilder<T = any> {
  constructor(private supabase: SupabaseClient<any, 'taxed'>) {}

  async query(options: QueryOptions) {
    // Validate input
    const validated = querySchema.parse(options);

    // Initialize query
    let query = this.supabase
      .from(validated.table)
      .select(
        validated.select,
        validated.count ? { count: validated.count } : undefined
      );

    // Apply filters
    if (validated.filters) {
      query = this.applyFilters(query, validated.filters);
    }

    // Apply search
    if (validated.search) {
      query = this.applySearch(query, validated.search);
    }

    // Apply sorting
    if (validated.sort) {
      query = this.applySorting(query, validated.sort);
    }

    // Apply pagination
    if (validated.pagination) {
      if (validated.pagination.type === 'offset') {
        query = this.applyOffsetPagination(query, validated.pagination);
      } else {
        query = this.applyCursorPagination(query, validated.pagination);
      }
    }

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return { data: data as T[], count };
  }

  private applyFilters(query: any, filters: QueryOptions['filters']) {
    return (
      filters?.reduce((q, filter) => {
        switch (filter.operator) {
          case 'eq':
            return q.eq(filter.field, filter.value);
          case 'neq':
            return q.neq(filter.field, filter.value);
          case 'gt':
            return q.gt(filter.field, filter.value);
          case 'gte':
            return q.gte(filter.field, filter.value);
          case 'lt':
            return q.lt(filter.field, filter.value);
          case 'lte':
            return q.lte(filter.field, filter.value);
          case 'like':
            return q.like(filter.field, `%${filter.value}%`);
          case 'ilike':
            return q.ilike(filter.field, `%${filter.value}%`);
          case 'in':
            return q.in(filter.field, filter.value as any[]);
          case 'is':
            return q.is(filter.field, filter.value);
          case 'cs':
            return q.contains(filter.field, filter.value);
          case 'cd':
            return q.containedBy(filter.field, filter.value);
          default:
            return q;
        }
      }, query) ?? query
    );
  }

  private applySearch(query: any, search: QueryOptions['search']) {
    return query.or(
      search?.fields
        ?.map((field) => `${field}.ilike.%${search.term}%`)
        .join(',')
    );
  }

  private applySorting(query: any, sort: QueryOptions['sort']) {
    return query.order(sort?.field, { ascending: sort?.direction === 'asc' });
  }

  private applyOffsetPagination(
    query: any,
    pagination: Extract<QueryOptions['pagination'], { type: 'offset' }>
  ) {
    const { page, pageSize } = pagination;
    return query.range((page - 1) * pageSize, page * pageSize - 1);
  }

  private applyCursorPagination(
    query: any,
    pagination: Extract<QueryOptions['pagination'], { type: 'cursor' }>
  ) {
    const { cursor, limit, direction, cursorField } = pagination;

    if (cursor) {
      query =
        direction === 'forward'
          ? query.gt(cursorField, cursor)
          : query.lt(cursorField, cursor);
    }

    return query
      .order(cursorField, { ascending: direction === 'forward' })
      .limit(limit);
  }
}
