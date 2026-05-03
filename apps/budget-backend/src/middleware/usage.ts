import type { MiddlewareHandler } from 'hono';
import { env } from 'hono/adapter';
import { createSupabaseAdmin } from '../lib/supabase';
import type { Env } from '../types/env';

type IncrementResult = {
  calls_this_month: number;
  monthly_limit: number;
  allowed: boolean;
};

export const meterUsage: MiddlewareHandler = async (c, next) => {
  const userId = c.get('userId');
  if (!userId) {
    return c.json({ error: 'unauthenticated' }, 401);
  }

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = env<Env>(c);
  const admin = createSupabaseAdmin(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data, error } = await admin.rpc('increment_usage', {
    p_user_id: userId,
  });

  if (error) {
    console.error('usage rpc failed', error);
    return c.json({ error: 'usage_check_failed' }, 500);
  }

  const row = (Array.isArray(data) ? data[0] : data) as IncrementResult | null;
  if (!row) {
    return c.json({ error: 'usage_check_failed' }, 500);
  }

  if (!row.allowed) {
    return c.json(
      {
        error: 'monthly_limit_reached',
        used: row.calls_this_month,
        limit: row.monthly_limit,
      },
      429
    );
  }

  c.header('X-Usage-Calls', String(row.calls_this_month));
  c.header('X-Usage-Limit', String(row.monthly_limit));

  await next();
};
