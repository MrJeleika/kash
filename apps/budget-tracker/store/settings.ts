import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  alwaysShowIncomes: boolean;
  roundTotals: boolean;
  voiceLanguage: string;
  setAlwaysShowIncomes: (value: boolean) => void;
  setRoundTotals: (value: boolean) => void;
  setVoiceLanguage: (language: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      alwaysShowIncomes: false,
      roundTotals: false,
      voiceLanguage: 'Ukrainian (Ukraine)',
      setAlwaysShowIncomes: (value) => set({ alwaysShowIncomes: value }),
      setRoundTotals: (value) => set({ roundTotals: value }),
      setVoiceLanguage: (language) => set({ voiceLanguage: language }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
