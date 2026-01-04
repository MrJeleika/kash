export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  categoryName: string;
  type: TransactionType;
  date: string; // ISO string format
  note?: string;
  amount: number;
  amountInBaseCurrency: number;
  currency: string;
}
