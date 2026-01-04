import { useCurrencyStore } from '@/store/currency';
import { Currencies } from '@/types/currencies';

export const useSortedCurrencies = (
  currencies?: Currencies,
  search?: string
): { favorites: [string, string][]; all: [string, string][] } => {
  const { favoriteCurrencies, currency } = useCurrencyStore();
  if (!currencies) return { favorites: [], all: [] };
  const favorites = Object.entries(currencies).filter(
    ([currencyCode]) =>
      favoriteCurrencies.includes(currencyCode) || currencyCode === currency
  );
  const all = Object.entries(currencies).filter(
    ([currencyCode]) =>
      !favoriteCurrencies.includes(currencyCode) &&
      currencyCode !== currency &&
      currencyCode.toLowerCase().includes(search?.toLowerCase() || '')
  );
  return {
    favorites: favorites as [string, string][],
    all: all as [string, string][],
  };
};
