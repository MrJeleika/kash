import { useTransactionsStore } from '@/store/transactions';
import { useCategoriesStore } from '@/store/categories';
import { computeInsights, type InsightsResult } from '@/utils/insights';
import { useMemo } from 'react';

export type {
  CategoryBreakdown,
  DailyBucket,
  InsightsResult,
} from '@/utils/insights';

export const useInsights = (): InsightsResult => {
  const transactions = useTransactionsStore((s) => s.transactions);
  const period = useTransactionsStore((s) => s.period);
  const { getCategoryByName } = useCategoriesStore();

  return useMemo(
    () =>
      computeInsights(
        transactions,
        period,
        (name) => getCategoryByName(name)?.color
      ),
    [transactions, period, getCategoryByName]
  );
};
