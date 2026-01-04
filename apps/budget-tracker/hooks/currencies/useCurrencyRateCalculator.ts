import { useMemo } from 'react';
import { useCurrencyStore } from '@/store/currency';
import { CurrencyRates } from '@/types/currencies';
import { useCurrencyRates } from './useCurrencyRates';

export const useCurrencyRateCalculator = (
  targetCurrency: string,
  amount: string
) => {
  const { currency: defaultCurrency } = useCurrencyStore();
  const { data: currencyRatesResponse } = useCurrencyRates();

  const rate = useMemo(() => {
    if (!currencyRatesResponse) return null;

    const currencyRates = currencyRatesResponse[
      defaultCurrency
    ] as CurrencyRates;

    if (!currencyRates || !currencyRates[targetCurrency]) return null;
    return currencyRates[targetCurrency];
  }, [targetCurrency, currencyRatesResponse, defaultCurrency]);

  const amountInBaseCurrency = useMemo(() => {
    if (!rate || !amount || !Number.isFinite(Number(amount))) return null;
    const result = Number(amount) / rate;
    return Number(result.toFixed(2)).toString();
  }, [amount, rate]);

  return { rate, amountInBaseCurrency };
};
