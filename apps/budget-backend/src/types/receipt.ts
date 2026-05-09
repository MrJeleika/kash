import z from 'zod';

// 6 MB of base64 ≈ 4.5 MB binary, which is more than any reasonable receipt
// photo. Anything larger gets rejected before we ever call OpenAI.
const RECEIPT_BASE64_MAX = 6_000_000;

export const receiptInputSchema = z.object({
  /**
   * The receipt image as a base64-encoded JPEG/PNG, without the
   * `data:image/...;base64,` prefix.
   */
  imageBase64: z
    .string()
    .min(100, 'image too small')
    .max(RECEIPT_BASE64_MAX, 'image too large'),
  imageMime: z
    .enum(['image/jpeg', 'image/png', 'image/webp'])
    .default('image/jpeg'),
  categories: z
    .array(z.string().min(1).max(64))
    .min(1, 'At least one category is required')
    .max(80),
  baseCurrency: z.string().min(3).max(8).optional(),
});

export type ReceiptInput = z.infer<typeof receiptInputSchema>;

export const receiptOutputSchema = z.object({
  transaction: z.object({
    categoryName: z.string(),
    type: z.enum(['expense', 'income']),
    amount: z.number().positive(),
    currency: z.string().nullable(),
    merchant: z.string().nullable(),
    date: z.string().nullable(), // YYYY-MM-DD
  }),
  lineItems: z
    .array(
      z.object({
        name: z.string(),
        amount: z.number(),
      })
    )
    .optional(),
  notes: z.string().nullable().optional(),
});

export type ReceiptOutput = z.infer<typeof receiptOutputSchema>;
