import type { Context } from 'hono';
import { env } from 'hono/adapter';
import { createSupabaseAdmin } from '../lib/supabase';
import type { Env } from '../types/env';

export const deleteAccount = async (c: Context) => {
  const userId = c.get('userId') as string;
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = env<Env>(c);
  const admin = createSupabaseAdmin(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Cascade in the schema (profiles → auth.users, categories/transactions/usage
  // → profiles) means deleting the auth user wipes every row owned by them.
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    return c.json({ error: 'delete_failed', message: error.message }, 500);
  }
  return c.json({ ok: true });
};
