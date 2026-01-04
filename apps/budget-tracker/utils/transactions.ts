import { Transaction } from '@/types/transactions';

export interface GroupedTransaction {
  date: string; // Formatted as "Monday, 29 Dec 2025"
  total: number;
  transactions: Transaction[];
}

/**
 * Groups transactions by date and calculates totals for each day
 * @param transactions - Array of transactions to group
 * @returns Array of grouped transactions sorted by date (newest first)
 */
export function groupTransactionsByDate(
  transactions: Transaction[]
): GroupedTransaction[] {
  // Group transactions by date (day level)
  const groupedMap = new Map<string, Transaction[]>();

  transactions.forEach((transaction) => {
    const dateKey = transaction.date.split('T')[0]; // Get YYYY-MM-DD format
    if (!groupedMap.has(dateKey)) {
      groupedMap.set(dateKey, []);
    }
    groupedMap.get(dateKey)!.push(transaction);
  });

  // Convert map to array and format
  const grouped: GroupedTransaction[] = Array.from(groupedMap.entries()).map(
    ([dateKey, transactionList]) => {
      const date = new Date(dateKey);
      const formattedDate = formatDate(date);
      const total = transactionList.reduce(
        (sum, transaction) => sum + transaction.amountInBaseCurrency,
        0
      );

      // Sort transactions within the day (newest first, or by time if available)
      const sortedTransactions = [...transactionList].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });

      return {
        date: formattedDate,
        total,
        transactions: sortedTransactions,
      };
    }
  );

  // Sort groups by date (newest first)
  return grouped.sort((a, b) => {
    const dateA = new Date(a.transactions[0].date);
    const dateB = new Date(b.transactions[0].date);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Formats a date as "Monday, 29 Dec 2025"
 */
function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}
