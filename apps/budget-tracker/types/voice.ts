import { Transaction } from './transactions';

export type VoiceTranscribe = Pick<
  Transaction,
  'amount' | 'currency' | 'categoryName' | 'type'
>;

export type VoiceTranscribeResponse = VoiceTranscribe[];
