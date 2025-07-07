import { env } from '@/configs/env';
import { createClient } from '@supabase/supabase-js';

export const supabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  { db: { schema: 'taxed' } }
);
