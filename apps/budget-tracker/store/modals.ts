import { Category } from '@/types/categories';
import { Transaction } from '@/types/transactions';
import { create } from 'zustand';

export type TransactionDraft = Partial<
  Omit<Transaction, 'id' | 'updatedAt' | 'syncedAt' | 'deletedAt'>
>;

interface ModalsState {
  addTransactionOpen: boolean;
  setAddTransactionOpen: (open: boolean) => void;

  /** When set, the modal opens in edit mode for the given transaction. */
  transactionToEdit: Transaction | null;
  setTransactionToEdit: (transaction: Transaction | null) => void;

  /** When set, the modal opens with these initial values (e.g., OCR pre-fill). */
  transactionDraft: TransactionDraft | null;
  setTransactionDraft: (draft: TransactionDraft | null) => void;

  currenciesModalOpen: boolean;
  setCurrenciesModalOpen: (open: boolean) => void;

  voiceInputOpen: boolean;
  setVoiceInputOpen: (open: boolean) => void;

  periodSelectorModalOpen: boolean;
  setPeriodSelectorModalOpen: (open: boolean) => void;

  categoriesModalOpen: boolean;
  setCategoriesModalOpen: (open: boolean) => void;

  categoryToEdit: Category | null;
  setCategoryToEdit: (category: Category | null) => void;
  addCategoryModalOpen: boolean;
  setAddCategoryModalOpen: (open: boolean) => void;
}

export const useModalsStore = create<ModalsState>((set) => ({
  addTransactionOpen: false,
  setAddTransactionOpen: (open) => set({ addTransactionOpen: open }),

  transactionToEdit: null,
  setTransactionToEdit: (transaction) =>
    set({ transactionToEdit: transaction }),

  transactionDraft: null,
  setTransactionDraft: (draft) => set({ transactionDraft: draft }),

  currenciesModalOpen: false,
  setCurrenciesModalOpen: (open) => set({ currenciesModalOpen: open }),

  voiceInputOpen: false,
  setVoiceInputOpen: (open) => set({ voiceInputOpen: open }),

  periodSelectorModalOpen: false,
  setPeriodSelectorModalOpen: (open) => set({ periodSelectorModalOpen: open }),

  categoriesModalOpen: false,
  setCategoriesModalOpen: (open) => set({ categoriesModalOpen: open }),

  addCategoryModalOpen: false,
  setAddCategoryModalOpen: (open) => set({ addCategoryModalOpen: open }),

  categoryToEdit: null,
  setCategoryToEdit: (category) => set({ categoryToEdit: category }),
}));
