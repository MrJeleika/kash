import { Category } from '@/types/categories';
import { Transaction } from '@/types/transactions';
import { create } from 'zustand';

interface ModalsState {
  addTransactionOpen: boolean;
  setAddTransactionOpen: (open: boolean) => void;
  transactionToEdit: Transaction | null;
  setTransactionToEdit: (transaction: Transaction | null) => void;

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

  currenciesModalOpen: false,
  setCurrenciesModalOpen: (open) => set({ currenciesModalOpen: open }),

  voiceInputOpen: false,
  setVoiceInputOpen: (open) => set({ voiceInputOpen: open }),

  transactionToEdit: null,
  setTransactionToEdit: (transaction) =>
    set({ transactionToEdit: transaction }),

  periodSelectorModalOpen: false,
  setPeriodSelectorModalOpen: (open) => set({ periodSelectorModalOpen: open }),

  categoriesModalOpen: false,
  setCategoriesModalOpen: (open) => set({ categoriesModalOpen: open }),

  addCategoryModalOpen: false,
  setAddCategoryModalOpen: (open) => set({ addCategoryModalOpen: open }),

  categoryToEdit: null,
  setCategoryToEdit: (category) => set({ categoryToEdit: category }),
}));
