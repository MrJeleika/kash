import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CurrencyState {
  currency: string;
  favoriteCurrencies: string[];
  setCurrency: (currency: string) => void;
  addFavoriteCurrency: (currency: string) => void;
  removeFavoriteCurrency: (currency: string) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'usd',
      favoriteCurrencies: [],
      setCurrency: (currency) => set({ currency }),
      addFavoriteCurrency: (currency) =>
        set((state) => ({
          favoriteCurrencies: [...state.favoriteCurrencies, currency],
        })),
      removeFavoriteCurrency: (currency) =>
        set((state) => ({
          favoriteCurrencies: state.favoriteCurrencies.filter(
            (c) => c !== currency
          ),
        })),
    }),
    {
      name: 'currency-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
