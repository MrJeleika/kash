import { API_URL } from '@/constants/api';
import { useCategoriesStore } from '@/store/categories';
import { VoiceTranscribeResponse } from '@/types/voice';
import { useMutation } from '@tanstack/react-query';

export const useTranscribeToTransactions = () => {
  const { categories } = useCategoriesStore();
  return useMutation({
    mutationFn: async (transcript: string) => {
      const response = await fetch(`${API_URL}/voice-input`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          categories: categories.map((cat) => cat.name),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe to transactions');
      }

      return response.json() as Promise<VoiceTranscribeResponse>;
    },
  });
};
