import { TransactionType } from './transactions';

export interface Category {
  /** Stable client UUID. Pre-existing categories without one get assigned on first save. */
  id?: string;
  name: string;
  color: string;
  type: TransactionType;
  /** Icon name (e.g., "CircleSlash", "ForkKnife") */
  icon: string;
  updatedAt?: string;
  syncedAt?: string | null;
  deletedAt?: string;
}
