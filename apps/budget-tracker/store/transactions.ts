import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '@/types/transactions';
import { generateUuid } from '@MrJeleika/utils';

interface TransactionsState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (
    id: string,
    transaction: Partial<Omit<Transaction, 'id'>>
  ) => void;
  removeTransaction: (id: string) => void;
  getAllTransactions: () => Transaction[];
  getTransactionById: (id: string) => Transaction | undefined;
}

const STORAGE_KEY = 'transactions-storage';

export const useTransactionsStore = create<TransactionsState>()(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: generateUuid(),
        };
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },

      updateTransaction: (id, updatedFields) => {
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === id
              ? { ...transaction, ...updatedFields }
              : transaction
          ),
        }));
      },

      removeTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter(
            (transaction) => transaction.id !== id
          ),
        }));
      },

      getAllTransactions: () => {
        return get().transactions;
      },

      getTransactionById: (id) => {
        return get().transactions.find((transaction) => transaction.id === id);
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ transactions: state.transactions }),
    }
  )
);
