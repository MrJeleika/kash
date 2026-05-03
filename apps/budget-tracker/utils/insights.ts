import type { Transaction } from '@/types/transactions';
import type { PeriodConfig } from '@/types/periods';

export interface CategoryBreakdown {
  name: string;
  color: string;
  total: number;
  /** 0..1 share of total expense for the period. */
  share: number;
}

export interface DailyBucket {
  /** YYYY-MM-DD */
  date: string;
  total: number;
}

export interface MerchantBucket {
  name: string;
  total: number;
  count: number;
}

export interface InsightsResult {
  totalExpense: number;
  totalIncome: number;
  net: number;
  txCount: number;
  byCategory: CategoryBreakdown[];
  byDay: DailyBucket[];
  topMerchants: MerchantBucket[];
}

const TOP_MERCHANTS_LIMIT = 5;

const isInPeriod = (t: Transaction, p: PeriodConfig) =>
  !t.deletedAt && t.date >= p.from && t.date <= p.to;

export const computeInsights = (
  transactions: Transaction[],
  period: PeriodConfig,
  resolveCategoryColor: (name: string) => string | undefined
): InsightsResult => {
  const inPeriod = transactions.filter((t) => isInPeriod(t, period));

  const totalExpense = inPeriod
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + Math.abs(t.amountInBaseCurrency), 0);
  const totalIncome = inPeriod
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + Math.abs(t.amountInBaseCurrency), 0);

  const catTotals = new Map<string, number>();
  for (const t of inPeriod) {
    if (t.type !== 'expense') continue;
    catTotals.set(
      t.categoryName,
      (catTotals.get(t.categoryName) ?? 0) + Math.abs(t.amountInBaseCurrency)
    );
  }
  const byCategory: CategoryBreakdown[] = Array.from(catTotals.entries())
    .map(([name, total]) => ({
      name,
      color: resolveCategoryColor(name) ?? '#7A7469',
      total,
      share: totalExpense > 0 ? total / totalExpense : 0,
    }))
    .sort((a, b) => b.total - a.total);

  const dayTotals = new Map<string, number>();
  for (const t of inPeriod) {
    if (t.type !== 'expense') continue;
    const day = t.date.slice(0, 10);
    dayTotals.set(
      day,
      (dayTotals.get(day) ?? 0) + Math.abs(t.amountInBaseCurrency)
    );
  }
  const byDay: DailyBucket[] = Array.from(dayTotals.entries())
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const merchantTotals = new Map<string, MerchantBucket>();
  for (const t of inPeriod) {
    if (t.type !== 'expense') continue;
    const key = (t.merchant || t.categoryName).trim();
    const cur = merchantTotals.get(key) ?? { name: key, total: 0, count: 0 };
    cur.total += Math.abs(t.amountInBaseCurrency);
    cur.count += 1;
    merchantTotals.set(key, cur);
  }
  const topMerchants = Array.from(merchantTotals.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, TOP_MERCHANTS_LIMIT);

  return {
    totalExpense,
    totalIncome,
    net: totalIncome - totalExpense,
    txCount: inPeriod.length,
    byCategory,
    byDay,
    topMerchants,
  };
};
