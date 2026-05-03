import OpenAI from 'openai';
import { receiptOutputSchema, type ReceiptOutput } from '../types/receipt.js';

interface ProcessReceiptArgs {
  imageBase64: string;
  imageMime: 'image/jpeg' | 'image/png' | 'image/webp';
  categories: string[];
  openAiKey: string;
  baseCurrency?: string;
}

export const processReceipt = async ({
  imageBase64,
  imageMime,
  categories,
  openAiKey,
  baseCurrency,
}: ProcessReceiptArgs): Promise<ReceiptOutput> => {
  const openai = new OpenAI({ apiKey: openAiKey });

  const systemPrompt = `You extract a single financial transaction from a receipt photo.

Allowed categories: ${categories.join(', ')}
${baseCurrency ? `User's base currency hint: ${baseCurrency}` : ''}

Return JSON with this shape:
{
  "transaction": {
    "categoryName": "<one of the allowed categories — pick the best fit>",
    "type": "expense",
    "amount": <total amount paid as a positive number>,
    "currency": "<3-letter ISO currency code, lowercase, e.g. 'usd', 'eur', or null if unreadable>",
    "merchant": "<merchant/store name, or null>",
    "date": "<transaction date as YYYY-MM-DD, or null if not visible>"
  },
  "lineItems": [{ "name": "<item>", "amount": <number> }],
  "notes": "<short free-text remark, or null>"
}

If the image is not a receipt, return amount: 0 and notes: "not_a_receipt".`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:${imageMime};base64,${imageBase64}`,
              detail: 'high',
            },
          },
          { type: 'text', text: 'Extract the transaction.' },
        ],
      },
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' },
    max_tokens: 800,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from OpenAI');

  const parsed = JSON.parse(content);
  const validated = receiptOutputSchema.parse(parsed);

  if (
    validated.transaction.categoryName &&
    !categories.includes(validated.transaction.categoryName)
  ) {
    // Soft-coerce to the closest category by case-insensitive match, else
    // first allowed.
    const lower = validated.transaction.categoryName.toLowerCase();
    const match =
      categories.find((c) => c.toLowerCase() === lower) ?? categories[0];
    validated.transaction.categoryName = match;
  }

  return validated;
};
