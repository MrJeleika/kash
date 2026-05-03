import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { env } from 'hono/adapter';
import { voiceInputSchema } from './types/voice';
import { receiptInputSchema } from './types/receipt';
import { processVoiceInput } from './voice/voice';
import { processReceipt } from './receipt/receipt';
import { createRateLimiter } from './utils/rateLimiter';
import { requireAuth } from './middleware/auth';
import { meterUsage } from './middleware/usage';
import type { Env } from './types/env';

const app = new Hono();

app.get('/', (c) => c.json({ message: 'Hello World' }));

// IP rate limiter is a cheap DoS shield in front of the auth + per-user
// monthly metering, which is the real quota.
const aiGate = [
  createRateLimiter(1000 * 60, 30),
  requireAuth,
  meterUsage,
] as const;

app.post(
  '/voice-input',
  ...aiGate,
  zValidator('json', voiceInputSchema),
  async (c) => {
    const { transcript, categories } = c.req.valid('json');
    const { OPENAI_API_KEY } = env<Env>(c);
    try {
      const processed = await processVoiceInput(
        transcript,
        categories,
        OPENAI_API_KEY
      );
      return c.json(processed);
    } catch (error) {
      console.error('Error processing voice input:', error);
      return c.json(
        {
          error: 'Failed to process voice input',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        500
      );
    }
  }
);

app.post(
  '/receipt',
  ...aiGate,
  zValidator('json', receiptInputSchema),
  async (c) => {
    const { imageBase64, imageMime, categories, baseCurrency } =
      c.req.valid('json');
    const { OPENAI_API_KEY } = env<Env>(c);
    try {
      const result = await processReceipt({
        imageBase64,
        imageMime,
        categories,
        openAiKey: OPENAI_API_KEY,
        baseCurrency,
      });
      return c.json(result);
    } catch (error) {
      console.error('Error processing receipt:', error);
      return c.json(
        {
          error: 'Failed to process receipt',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        500
      );
    }
  }
);

export default app;
