import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '@/types/transactions';
import { generateUuid } from '@/utils/shared';
import { PeriodConfig } from '@/types/periods';

type NewTransaction = Omit<Transaction, 'id' | 'updatedAt' | 'syncedAt' | 'deletedAt'>;

interface TransactionsState {
  period: PeriodConfig;
  setPeriod: (period: PeriodConfig) => void;

  transactions: Transaction[];
  addTransaction: (transaction: NewTransaction) => Transaction;
  updateTransaction: (
    id: string,
    transaction: Partial<NewTransaction>
  ) => void;
  reassignCategory: (fromName: string, toName: string) => void;
  removeTransaction: (id: string) => void;
  /** Returns visible (non-deleted) transactions. */
  getAllTransactions: () => Transaction[];
  getTransactionById: (id: string) => Transaction | undefined;

  /** Sync helpers — used by the sync worker. */
  getDirtyTransactions: () => Transaction[];
  markSynced: (ids: string[], syncedAt: string) => void;
  /** Permanently drop a soft-deleted row after the server confirms deletion. */
  purgeDeleted: (ids: string[]) => void;
}

const STORAGE_KEY = 'transactions-storage';

const now = () => new Date().toISOString();

export const useTransactionsStore = create<TransactionsState>()(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction: (transaction) => {
        const ts = now();
        const newTransaction: Transaction = {
          ...transaction,
          id: generateUuid(),
          updatedAt: ts,
          syncedAt: null,
        };
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
        return newTransaction;
      },

      updateTransaction: (id, updatedFields) => {
        const ts = now();
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id
              ? { ...t, ...updatedFields, updatedAt: ts, syncedAt: null }
              : t
          ),
        }));
      },

      reassignCategory: (fromName, toName) => {
        if (fromName === toName) return;
        const ts = now();
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.categoryName === fromName && !t.deletedAt
              ? { ...t, categoryName: toName, updatedAt: ts, syncedAt: null }
              : t
          ),
        }));
      },

      removeTransaction: (id) => {
        const ts = now();
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id
              ? { ...t, deletedAt: ts, updatedAt: ts, syncedAt: null }
              : t
          ),
        }));
      },

      getAllTransactions: () =>
        get().transactions.filter((t) => !t.deletedAt),

      getTransactionById: (id) => {
        const t = get().transactions.find((tx) => tx.id === id);
        return t && !t.deletedAt ? t : undefined;
      },

      getDirtyTransactions: () =>
        get().transactions.filter((t) => t.syncedAt === null),

      markSynced: (ids, syncedAt) => {
        const idSet = new Set(ids);
        set((state) => ({
          transactions: state.transactions.map((t) =>
            idSet.has(t.id) ? { ...t, syncedAt } : t
          ),
        }));
      },

      purgeDeleted: (ids) => {
        const idSet = new Set(ids);
        set((state) => ({
          transactions: state.transactions.filter((t) => !idSet.has(t.id)),
        }));
      },

      period: {
        label: 'All Time',
        from: '1970-01-01',
        to: new Date().toISOString(),
      },
      setPeriod: (period) => set({ period }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        period: state.period,
      }),
      version: 2,
      migrate: (persisted: unknown, fromVersion) => {
        const state = persisted as Partial<TransactionsState> | undefined;
        if (!state || fromVersion >= 2) return state as TransactionsState;
        // v1 → v2: backfill sync metadata for pre-existing rows.
        const migratedAt = now();
        return {
          ...state,
          transactions: (state.transactions ?? []).map((t) => ({
            ...t,
            updatedAt: t.updatedAt ?? migratedAt,
            syncedAt: t.syncedAt ?? null,
          })),
        } as TransactionsState;
      },
    }
  )
);
