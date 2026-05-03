import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const createSupabaseAuth = (
  url: string,
  anonKey: string
): SupabaseClient =>
  createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

export const createSupabaseAdmin = (
  url: string,
  serviceRoleKey: string
): SupabaseClient =>
  createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
