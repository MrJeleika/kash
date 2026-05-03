import { apiPost, ApiError } from '@/lib/api';
import { useCategoriesStore } from '@/store/categories';
import { useCurrencyStore } from '@/store/currency';
import { compressForVision } from '@/utils/photo';
import { useMutation } from '@tanstack/react-query';

export interface ReceiptResult {
  transaction: {
    categoryName: string;
    type: 'expense' | 'income';
    amount: number;
    currency: string | null;
    merchant: string | null;
    date: string | null;
  };
  lineItems?: Array<{ name: string; amount: number }>;
  notes?: string | null;
}

export const useOcrReceipt = () => {
  const { categories } = useCategoriesStore();
  const { currency: baseCurrency } = useCurrencyStore();

  return useMutation<ReceiptResult, ApiError, { uri: string }>({
    mutationFn: async ({ uri }) => {
      const { base64, mime } = await compressForVision(uri);
      return apiPost<ReceiptResult>('/receipt', {
        imageBase64: base64,
        imageMime: mime,
        categories: categories.filter((c) => !c.deletedAt).map((c) => c.name),
        baseCurrency,
      });
    },
  });
};
