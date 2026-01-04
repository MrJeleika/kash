import { useCurrencyStore } from '@/store/currency';
import { CurrencyRatesResponse } from '@/types/currencies';
import { useQuery } from '@tanstack/react-query';

export const useCurrencyRates = () => {
  const { currency } = useCurrencyStore();
  return useQuery({
    queryKey: ['currency-rates', currency],
    queryFn: async () => {
      const response = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`
      );
      const data = await response.json();
      return data as CurrencyRatesResponse;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
