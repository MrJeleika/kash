import { create } from 'zustand';

interface ModalsState {
  addTransactionOpen: boolean;
  setAddTransactionOpen: (open: boolean) => void;

  currenciesModalOpen: boolean;
  setCurrenciesModalOpen: (open: boolean) => void;

  voiceInputOpen: boolean;
  setVoiceInputOpen: (open: boolean) => void;
}

export const useModalsStore = create<ModalsState>((set) => ({
  addTransactionOpen: false,
  setAddTransactionOpen: (open) => set({ addTransactionOpen: open }),

  currenciesModalOpen: false,
  setCurrenciesModalOpen: (open) => set({ currenciesModalOpen: open }),

  voiceInputOpen: false,
  setVoiceInputOpen: (open) => set({ voiceInputOpen: open }),
}));
