import { router } from '../middleware';
import { publicProcedure } from '../middleware';

export const systemRouter = router({
  health: publicProcedure.query(() => ({
    status: 'OK',
  })),
  version: publicProcedure.query(() => ({
    version: '1.0.0',
  })),
  ping: publicProcedure.query(() => ({
    message: 'pong',
  })),
});
