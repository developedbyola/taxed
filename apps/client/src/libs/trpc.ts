import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../server/dist/trpc/index';

export const trpc = createTRPCReact<AppRouter>();
