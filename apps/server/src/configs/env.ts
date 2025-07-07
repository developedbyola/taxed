import { parseEnv } from '@/utils/parseEnv';

export const env = {
  PORT: parseEnv('PORT'),
  NODE_ENV: parseEnv('NODE_ENV'),
  MAX_ACTIVE_SESSIONS: parseEnv('MAX_ACTIVE_SESSIONS'),
  SUPABASE_URL: parseEnv('SUPABASE_URL'),
  SUPABASE_ANON_KEY: parseEnv('SUPABASE_ANON_KEY'),
  SUPABASE_JWT_SECRET: parseEnv('SUPABASE_JWT_SECRET'),
  ACCESS_TOKEN_SECRET: parseEnv('ACCESS_TOKEN_SECRET'),
  REFRESH_TOKEN_SECRET: parseEnv('REFRESH_TOKEN_SECRET'),
};
