import type { MiddlewareHandler } from 'hono';
import { env } from 'hono/adapter';
import { createSupabaseAuth } from '../lib/supabase';
import type { Env } from '../types/env';

declare module 'hono' {
  interface ContextVariableMap {
    userId: string;
  }
}

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const header = c.req.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    return c.json({ error: 'missing_authorization' }, 401);
  }

  const jwt = header.slice('Bearer '.length).trim();
  if (!jwt) return c.json({ error: 'missing_authorization' }, 401);

  const { SUPABASE_URL, SUPABASE_ANON_KEY } = env<Env>(c);
  const supabase = createSupabaseAuth(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { data, error } = await supabase.auth.getUser(jwt);
  if (error || !data?.user) {
    return c.json({ error: 'invalid_token' }, 401);
  }

  c.set('userId', data.user.id);
  await next();
};
