import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { voiceInputSchema } from './types/voice';
import { processVoiceInput } from './voice/voice';
import { env } from 'hono/adapter';
import { createRateLimiter } from './utils/rateLimiter';

import { Env } from './types/env';

const app = new Hono();

app.get('/', (c) => {
  return c.json({
    message: 'Hello World',
  });
});

app.use('/voice-input', createRateLimiter(1000 * 60, 10)); // 10 requests per minute

app.post('/voice-input', zValidator('json', voiceInputSchema), async (c) => {
  const { transcript, categories } = c.req.valid('json');

  const { OPENAI_API_KEY } = env<Env>(c);
  try {
    const processedTransactions = await processVoiceInput(
      transcript,
      categories,
      OPENAI_API_KEY
    );

    return c.json(processedTransactions);
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
});

export default app;
