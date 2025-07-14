import { config } from 'dotenv';
config();

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { appRouter } from '@/trpc';
import { env } from './configs/env';
import { createContext } from '@/trpc/context';
import { trpcServer } from '@hono/trpc-server';

const app = new Hono();

// Enable CORS for all routes
app.use(
  '*',
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'https://paywithtaxed.web.app',
    ],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Allow-Origin',
      'X-Requested-With',
      'Accept',
      'X-CSRF-Token',
      'X-Request-Id',
      'X-HTTP-Method-Override',
      'X-HTTP-Method',
      'X-Method-Override',
    ],
    maxAge: 86400, // 24 hours
    credentials: true,
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  })
);

// tRPC routes
app.use(
  '/api/trpc/*',
  trpcServer({
    router: appRouter,
    endpoint: '/api/trpc',
    createContext: (_opts, c) => createContext(c),
  })
);
app.get('/', (c) => c.text('Hono + tRPC server is running!'));

console.log(`Server is running on port ${env.PORT}`);

export default app;
