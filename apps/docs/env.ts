import { vercel } from '@t3-oss/env-core/presets-zod';
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  extends: [vercel()],
  server: {
    ANALYZE: z.string().optional(),
  },
  client: {
  },
  runtimeEnv: {
    ANALYZE: process.env.ANALYZE,
  },
});
