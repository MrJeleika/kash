import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/hooks/auth/useSession';

const DEFAULT_LIMIT = 10;

const currentMonthIso = () => {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
    .toISOString()
    .split('T')[0];
};

export interface Usage {
  used: number;
  limit: number;
}

export const useUsage = () => {
  const session = useSession();
  const userId =
    session.status === 'authenticated' ? session.session.user.id : null;
  const month = currentMonthIso();

  return useQuery<Usage>({
    queryKey: ['usage', userId, month],
    enabled: !!userId,
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usage')
        .select('calls_this_month, monthly_limit')
        .eq('user_id', userId!)
        .eq('month', month)
        .maybeSingle();

      if (error) throw error;
      // No row yet — the user hasn't made any AI calls this month, so the row
      // simply doesn't exist (created lazily by increment_usage on first use).
      if (!data) return { used: 0, limit: DEFAULT_LIMIT };
      return {
        used: data.calls_this_month ?? 0,
        limit: data.monthly_limit ?? DEFAULT_LIMIT,
      };
    },
  });
};
