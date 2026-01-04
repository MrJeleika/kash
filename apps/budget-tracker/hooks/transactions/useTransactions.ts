import { useTransactionsStore } from '@/store/transactions';
import { groupTransactionsByDate } from '@/utils/transactions';
import { useMemo } from 'react';

export const useTransactions = () => {
  const { transactions, period } = useTransactionsStore();

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      return transaction.date >= period.from && transaction.date <= period.to;
    });
  }, [transactions, period]);

  const groupedTransactions = useMemo(() => {
    return groupTransactionsByDate(filteredTransactions);
  }, [filteredTransactions]);

  return groupedTransactions;
};
