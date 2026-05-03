import { apiPost } from '@/lib/api';
import { useCategoriesStore } from '@/store/categories';
import { VoiceTranscribeResponse } from '@/types/voice';
import { useMutation } from '@tanstack/react-query';

export const useTranscribeToTransactions = () => {
  const { categories } = useCategoriesStore();
  return useMutation({
    mutationFn: async (transcript: string) => {
      return apiPost<VoiceTranscribeResponse>('/voice-input', {
        transcript,
        categories: categories.filter((c) => !c.deletedAt).map((cat) => cat.name),
      });
    },
  });
};
