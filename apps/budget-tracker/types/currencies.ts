export type Currencies = Record<string, string>;

export interface CurrencyRatesResponse {
  date: string;
  [key: string]: string | CurrencyRates;
}

export type CurrencyRates = Record<string, number>;
