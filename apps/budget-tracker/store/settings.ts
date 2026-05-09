import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_VOICE_LOCALE } from '@/constants/languages';

interface SettingsState {
  voiceLocale: string;
  setVoiceLocale: (locale: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      voiceLocale: DEFAULT_VOICE_LOCALE,
      setVoiceLocale: (locale) => set({ voiceLocale: locale }),
    }),
    {
      name: 'settings-storage',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persisted: any, fromVersion) => {
        if (fromVersion < 2) {
          return { voiceLocale: DEFAULT_VOICE_LOCALE };
        }
        return persisted as SettingsState;
      },
    }
  )
);
