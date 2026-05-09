import { CurrencyRates } from '@/types/currencies';

export const todayIso = () => new Date().toISOString().split('T')[0];

export const convertToBase = (
  amount: number,
  fromCurrency: string,
  baseCurrency: string,
  rates: Record<string, CurrencyRates> | undefined
): number => {
  if (fromCurrency === baseCurrency) return amount;
  if (!rates) return amount;
  const baseRates = rates[baseCurrency];
  const rate = baseRates?.[fromCurrency];
  if (!rate) return amount;
  return Number((amount / rate).toFixed(2));
};
