import { useMutation } from '@tanstack/react-query';
import { useCategoriesStore } from '@/store/categories';

interface ProcessTranscriptParams {
  transcript: string;
}

interface ProcessTranscriptResponse {
  // Define your API response type here
  success: boolean;
  data?: any;
}

export const useProcessTranscript = () => {
  const categories = useCategoriesStore((state) => state.getAllCategories());

  return useMutation<ProcessTranscriptResponse, Error, ProcessTranscriptParams>(
    {
      mutationFn: async ({ transcript }: ProcessTranscriptParams) => {
        // TODO: Implement your API call here
        const response = await fetch('YOUR_API_ENDPOINT', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transcript,
            availableCategories: categories.map((cat) => ({
              name: cat.name,
              type: cat.type,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to process transcript');
        }

        return response.json() as Promise<ProcessTranscriptResponse>;
      },
    }
  );
};
