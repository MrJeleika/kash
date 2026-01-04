import type { MiddlewareHandler } from 'hono';

// Simple in-memory rate limiting for Cloudflare Workers
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const createRateLimiter = (
  windowMs: number = 1000 * 60, // 1 minute default
  limit: number = 5 // 5 requests default
): MiddlewareHandler => {
  return async (c, next) => {
    const clientIP = c.req.header('cf-connecting-ip') || 'unknown';
    const now = Date.now();

    const clientData = rateLimitStore.get(clientIP);

    if (!clientData || now > clientData.resetTime) {
      // First request or window expired
      rateLimitStore.set(clientIP, { count: 1, resetTime: now + windowMs });
    } else if (clientData.count >= limit) {
      // Rate limit exceeded
      return c.json(
        {
          error: 'Rate limit exceeded. Try again later.',
          retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
        },
        429
      );
    } else {
      // Increment count
      clientData.count++;
      rateLimitStore.set(clientIP, clientData);
    }

    await next();
  };
};
