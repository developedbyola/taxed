import { supabaseClient } from '@/lib/supabase';
import { createResponse } from '@/utils/response';
import { type Context as HonoContext } from 'hono';

export const createContext = async (c: HonoContext) => {
  const { success, error } = createResponse();

  return {
    fail: error,
    ok: success,
    res: c.res,
    req: c.req,
    honoContext: c,
    supabase: supabaseClient,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
