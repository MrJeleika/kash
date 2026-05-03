import z from 'zod';

// Define the schema for voice input validation
export const voiceInputSchema = z.object({
  transcript: z.string().min(1, 'Transcript cannot be empty').max(5000),
  categories: z
    .array(z.string())
    .min(1, 'At least one category is required')
    .max(100),
});

export type VoiceInput = z.infer<typeof voiceInputSchema>;

// Define the schema for processed voice output
export const processedVoiceSchema = z.object({
  transactions: z.array(
    z.object({
      categoryName: z.string(),
      type: z.enum(['expense', 'income']),
      amount: z.number(),
      currency: z.string().nullable(),
    })
  ),
});

export type ProcessedVoiceOutput = z.infer<typeof processedVoiceSchema>;
