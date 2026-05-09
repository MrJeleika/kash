import z from 'zod';

// Define the schema for voice input validation.
// Limits guard against credit-drain abuse: ~3000 chars covers the longest
// realistic multi-segment voice entry while staying well under one OpenAI
// request's worth of tokens.
export const voiceInputSchema = z.object({
  transcript: z
    .string()
    .min(1, 'Transcript cannot be empty')
    .max(3000, 'Transcript too long'),
  categories: z
    .array(z.string().min(1).max(64))
    .min(1, 'At least one category is required')
    .max(80),
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
