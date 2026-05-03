export type TransactionType = 'income' | 'expense';
export type InputMethod = 'manual' | 'voice' | 'photo';

export interface Transaction {
  id: string;
  categoryName: string;
  type: TransactionType;
  date: string;
  note?: string;
  merchant?: string;
  amount: number;
  currency: string;
  amountInBaseCurrency: number;
  baseCurrency: string;
  inputMethod?: InputMethod;
  /** ISO timestamp; bumped on every local edit. Drives last-write-wins sync. */
  updatedAt: string;
  /** ISO timestamp of last successful push to Supabase, or null if dirty. */
  syncedAt: string | null;
  /** Soft-delete marker for sync; reads filter rows where this is set. */
  deletedAt?: string;
}
