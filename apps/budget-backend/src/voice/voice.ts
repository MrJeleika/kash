import OpenAI from 'openai';
import {
  processedVoiceSchema,
  type ProcessedVoiceOutput,
} from '../types/voice.js';

import { env } from 'hono/adapter';

export const processVoiceInput = async (
  transcript: string,
  categories: string[],
  openAiKey: string
): Promise<ProcessedVoiceOutput['transactions']> => {
  const openai = new OpenAI({
    apiKey: openAiKey,
  });

  const systemPrompt = `Extract financial transactions from the transcript into JSON.

  Allowed categories: ${categories.join(', ')}
  
  Output format:
  {
    "transactions": [
      {
        "categoryName": "One of the allowed categories",
        "type": "expense" | "income",
        "amount": number,
        "currency": "iso_code" | null
      }
    ]
  }`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Transcript: ${transcript}` },
    ],
    temperature: 0.1, // Low temperature for more consistent parsing
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  try {
    // Parse the JSON response
    const parsed = JSON.parse(content);

    // Validate against our schema
    const validated = processedVoiceSchema.parse(parsed);

    // Additional validation: ensure categoryName is from available categories
    for (const item of validated.transactions) {
      if (!categories.includes(item.categoryName)) {
        throw new Error(
          `Invalid category: ${
            item.categoryName
          }. Must be one of: ${categories.join(', ')}`
        );
      }
    }

    return validated.transactions as ProcessedVoiceOutput['transactions'];
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    throw new Error('Failed to parse transaction data from AI response');
  }
};
