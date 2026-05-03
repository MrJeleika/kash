import { Transaction } from '@/types/transactions';
import { formatLongDate } from './format/dates';

export interface GroupedTransaction {
  /** Human-readable group label, e.g. "Monday, 29 Dec 2025". */
  date: string;
  total: number;
  transactions: Transaction[];
}

/**
 * Groups transactions by calendar day, totals each day, and sorts everything
 * newest-first. Inner transactions within a day are also sorted newest-first.
 */
export const groupTransactionsByDate = (
  transactions: Transaction[]
): GroupedTransaction[] => {
  const byDay = new Map<string, Transaction[]>();
  for (const t of transactions) {
    const dayKey = t.date.split('T')[0];
    const bucket = byDay.get(dayKey);
    if (bucket) bucket.push(t);
    else byDay.set(dayKey, [t]);
  }

  const groups: GroupedTransaction[] = Array.from(byDay.entries()).map(
    ([dayKey, items]) => {
      const sorted = [...items].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      return {
        date: formatLongDate(new Date(dayKey)),
        total: sorted.reduce((s, t) => s + t.amountInBaseCurrency, 0),
        transactions: sorted,
      };
    }
  );

  return groups.sort(
    (a, b) =>
      new Date(b.transactions[0].date).getTime() -
      new Date(a.transactions[0].date).getTime()
  );
};

/**
 * Returns groups containing only transactions in the given category.
 * Empty groups are dropped. Pass null to leave the input untouched.
 */
export const filterGroupsByCategory = (
  groups: GroupedTransaction[],
  categoryName: string | null
): GroupedTransaction[] => {
  if (!categoryName) return groups;
  return groups
    .map((g) => ({
      ...g,
      transactions: g.transactions.filter(
        (t) => t.categoryName === categoryName
      ),
    }))
    .filter((g) => g.transactions.length > 0);
};

/**
 * Sums the absolute base-currency expense across visible groups.
 */
export const totalExpense = (groups: GroupedTransaction[]): number =>
  groups
    .flatMap((g) => g.transactions)
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amountInBaseCurrency), 0);

/**
 * Filters the raw transaction list by free-text query (matched against
 * merchant + note + category) and an optional category name. Soft-deleted
 * rows are excluded.
 */
export const searchTransactions = (
  transactions: import('@/types/transactions').Transaction[],
  options: { query?: string; category?: string | null }
): import('@/types/transactions').Transaction[] => {
  const q = options.query?.trim().toLowerCase() ?? '';
  const cat = options.category ?? null;
  return transactions.filter((t) => {
    if (t.deletedAt) return false;
    if (cat && t.categoryName !== cat) return false;
    if (q) {
      const hay = [
        t.merchant?.toLowerCase() ?? '',
        t.note?.toLowerCase() ?? '',
        t.categoryName.toLowerCase(),
      ].join(' ');
      if (!hay.includes(q)) return false;
    }
    return true;
  });
};
