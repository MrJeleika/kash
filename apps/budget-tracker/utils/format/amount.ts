import { formatNumberWithSpaces } from '@/utils/shared';

export interface SplitAmount {
  whole: string;
  cents: string;
}

export function splitAmount(amount: number): SplitAmount {
  const fixed = Math.abs(amount).toFixed(2);
  const [whole, cents] = fixed.split('.');
  return { whole: formatNumberWithSpaces(whole), cents };
}
