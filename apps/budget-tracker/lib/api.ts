import { API_URL } from '@/constants/api';
import { supabase } from './supabase';

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown, message: string) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

const authHeader = async (): Promise<Record<string, string>> => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiPost = async <T>(path: string, body: unknown): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(await authHeader()),
  };
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let parsed: unknown = text;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    /* keep as text */
  }

  if (!res.ok) {
    const message =
      (parsed as { error?: string; message?: string } | null)?.error ??
      (parsed as { message?: string } | null)?.message ??
      `Request failed (${res.status})`;
    throw new ApiError(res.status, parsed, message);
  }

  return parsed as T;
};
