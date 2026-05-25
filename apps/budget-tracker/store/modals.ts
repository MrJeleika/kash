import { Category } from '@/types/categories';
import { Transaction, TransactionType } from '@/types/transactions';
import { create } from 'zustand';

export type TransactionDraft = Partial<
  Omit<Transaction, 'id' | 'updatedAt' | 'syncedAt' | 'deletedAt'>
>;

export type VoiceState =
  | 'idle'
  | 'listening'
  | 'reviewing'
  | 'processing'
  | 'ready'
  | 'empty'
  | 'error';

export interface DraftSavePayload {
  type: TransactionType;
  categoryName: string;
  amount: number;
  amountInBaseCurrency: number;
  currency: string;
  date: string;
  note?: string;
}

interface ModalsState {
  addTransactionOpen: boolean;
  setAddTransactionOpen: (open: boolean) => void;

  /** When set, the modal opens in edit mode for the given transaction. */
  transactionToEdit: Transaction | null;
  setTransactionToEdit: (transaction: Transaction | null) => void;

  /** When set, the modal opens with these initial values (e.g., OCR pre-fill). */
  transactionDraft: TransactionDraft | null;
  setTransactionDraft: (draft: TransactionDraft | null) => void;

  /** When set, the AddTransactionModal forwards Save to this callback instead of mutating the transactions store. */
  draftSaveOverride: ((payload: DraftSavePayload) => void) | null;
  setDraftSaveOverride: (
    override: ((payload: DraftSavePayload) => void) | null
  ) => void;

  voiceState: VoiceState;
  setVoiceState: (state: VoiceState) => void;

  voiceStopHandler: (() => void) | null;
  setVoiceStopHandler: (handler: (() => void) | null) => void;

  currenciesModalOpen: boolean;
  setCurrenciesModalOpen: (open: boolean) => void;

  languagesModalOpen: boolean;
  setLanguagesModalOpen: (open: boolean) => void;

  voiceInputOpen: boolean;
  setVoiceInputOpen: (open: boolean) => void;

  photoInputOpen: boolean;
  photoInputUri: string | null;
  openPhotoInput: (uri: string) => void;
  closePhotoInput: () => void;

  periodSelectorModalOpen: boolean;
  setPeriodSelectorModalOpen: (open: boolean) => void;

  categoriesModalOpen: boolean;
  setCategoriesModalOpen: (open: boolean) => void;

  categoryToEdit: Category | null;
  setCategoryToEdit: (category: Category | null) => void;
  addCategoryModalOpen: boolean;
  setAddCategoryModalOpen: (open: boolean) => void;

  dateSheetOpen: boolean;
  dateSheetValue: string;
  dateSheetOnConfirm: ((next: string) => void) | null;
  openDateSheet: (opts: {
    value: string;
    onConfirm: (next: string) => void;
  }) => void;
  closeDateSheet: () => void;
}

export const useModalsStore = create<ModalsState>((set) => ({
  addTransactionOpen: false,
  setAddTransactionOpen: (open) => set({ addTransactionOpen: open }),

  transactionToEdit: null,
  setTransactionToEdit: (transaction) =>
    set({ transactionToEdit: transaction }),

  transactionDraft: null,
  setTransactionDraft: (draft) => set({ transactionDraft: draft }),

  draftSaveOverride: null,
  setDraftSaveOverride: (override) => set({ draftSaveOverride: override }),

  voiceState: 'idle',
  setVoiceState: (state) => set({ voiceState: state }),

  voiceStopHandler: null,
  setVoiceStopHandler: (handler) => set({ voiceStopHandler: handler }),

  currenciesModalOpen: false,
  setCurrenciesModalOpen: (open) => set({ currenciesModalOpen: open }),

  languagesModalOpen: false,
  setLanguagesModalOpen: (open) => set({ languagesModalOpen: open }),

  voiceInputOpen: false,
  setVoiceInputOpen: (open) => set({ voiceInputOpen: open }),

  photoInputOpen: false,
  photoInputUri: null,
  openPhotoInput: (uri) => set({ photoInputOpen: true, photoInputUri: uri }),
  closePhotoInput: () => set({ photoInputOpen: false, photoInputUri: null }),

  periodSelectorModalOpen: false,
  setPeriodSelectorModalOpen: (open) => set({ periodSelectorModalOpen: open }),

  categoriesModalOpen: false,
  setCategoriesModalOpen: (open) => set({ categoriesModalOpen: open }),

  addCategoryModalOpen: false,
  setAddCategoryModalOpen: (open) => set({ addCategoryModalOpen: open }),

  categoryToEdit: null,
  setCategoryToEdit: (category) => set({ categoryToEdit: category }),

  dateSheetOpen: false,
  dateSheetValue: '',
  dateSheetOnConfirm: null,
  openDateSheet: ({ value, onConfirm }) =>
    set({
      dateSheetOpen: true,
      dateSheetValue: value,
      dateSheetOnConfirm: onConfirm,
    }),
  closeDateSheet: () =>
    set({ dateSheetOpen: false, dateSheetOnConfirm: null }),
}));
