import { useTranscribeToTransactions } from '@/hooks/voice/useTranscribeToTransactions';
import { useTransactionsStore } from '@/store/transactions';
import { useCurrencyStore } from '@/store/currency';
import { useCategoriesStore } from '@/store/categories';
import { useModalsStore } from '@/store/modals';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

// Safely import the module with error handling
let ExpoSpeechRecognitionModule: any = null;
let useSpeechRecognitionEvent: any = null;

try {
  const speechModule = require('expo-speech-recognition');
  ExpoSpeechRecognitionModule = speechModule.ExpoSpeechRecognitionModule;
  useSpeechRecognitionEvent = speechModule.useSpeechRecognitionEvent;
} catch (error) {
  console.log('Speech recognition module not available, using mock mode');
}

interface Props {
  voiceInputOpen: boolean;
}

const MOCK_TRANSCRIPTS = [
  'Spent 50 dollars on groceries',
  'Paid 20 for lunch at restaurant',
  'Received 100 from salary',
  'Coffee 5 dollars',
];

interface ParsedItem {
  categoryName: string;
  type: 'expense' | 'income';
  amount: number;
  currency: string | null;
}

export const TextRecognition = ({ voiceInputOpen }: Props) => {
  const { mutateAsync: transcribe, isPending } = useTranscribeToTransactions();
  const { addTransaction } = useTransactionsStore();
  const { currency: defaultCurrency } = useCurrencyStore();
  const { getCategoryByName } = useCategoriesStore();
  const setVoiceInputOpen = useModalsStore((s) => s.setVoiceInputOpen);

  const [transcript, setTranscript] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedItem[] | null>(null);
  const isMockMode = !ExpoSpeechRecognitionModule;

  const runTranscribe = async (finalTranscript: string) => {
    try {
      const items = (await transcribe(finalTranscript)) as ParsedItem[];
      setParsed(items);
    } catch (e: any) {
      setError(e?.message ?? 'Could not parse');
    }
  };

  const handleStart = async () => {
    setError(null);
    setParsed(null);
    setTranscript('');

    if (isMockMode) {
      setIsRecognizing(true);
      const mockTranscript =
        MOCK_TRANSCRIPTS[Math.floor(Math.random() * MOCK_TRANSCRIPTS.length)];
      let cur = '';
      for (let i = 0; i < mockTranscript.length; i++) {
        setTimeout(() => {
          cur += mockTranscript[i];
          setTranscript(cur);
        }, i * 50);
      }
      setTimeout(async () => {
        setIsRecognizing(false);
        await runTranscribe(mockTranscript);
      }, mockTranscript.length * 50 + 200);
      return;
    }

    try {
      const result =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        setError('Microphone permission denied');
        return;
      }
      setIsRecognizing(true);
      ExpoSpeechRecognitionModule.start({
        lang: 'en-US',
        interimResults: true,
        continuous: false,
      });
    } catch (err) {
      setError('Failed to start speech recognition');
      setIsRecognizing(false);
    }
  };

  if (useSpeechRecognitionEvent) {
    useSpeechRecognitionEvent('result', (event: any) => {
      setTranscript(event.results[0]?.transcript || '');
    });
    useSpeechRecognitionEvent('end', () => {
      setIsRecognizing(false);
      const final = transcript;
      if (final.trim()) void runTranscribe(final);
    });
    useSpeechRecognitionEvent('error', (event: any) => {
      setError(event.error);
      setIsRecognizing(false);
    });
  }

  useEffect(() => {
    if (voiceInputOpen) {
      handleStart();
    } else {
      setIsRecognizing(false);
      setParsed(null);
    }
  }, [voiceInputOpen]);

  const commit = () => {
    if (!parsed) return;
    for (const p of parsed) {
      const isExpense = p.type === 'expense';
      const amount = Math.abs(p.amount);
      const currency = (p.currency ?? defaultCurrency).toLowerCase();
      const category = getCategoryByName(p.categoryName)?.name ?? p.categoryName;
      addTransaction({
        type: p.type,
        categoryName: category,
        amount: isExpense ? -amount : amount,
        currency,
        amountInBaseCurrency: isExpense ? -amount : amount,
        baseCurrency: defaultCurrency,
        date: new Date().toISOString(),
        inputMethod: 'voice',
      });
    }
    setVoiceInputOpen(false);
  };

  return (
    <View
      pointerEvents="box-none"
      className="absolute bottom-28 left-4 right-4 bg-background rounded-xl border border-border p-4 gap-2"
    >
      {error && <Text className="text-accent text-sm">Error: {error}</Text>}

      {isRecognizing && !transcript && (
        <Text className="text-text-muted italic uppercase tracking-widest text-xs text-center">
          Listening…
        </Text>
      )}

      {transcript ? (
        <Text className="text-text text-center">{transcript}</Text>
      ) : null}

      {isPending && (
        <Text className="text-text-muted text-xs text-center uppercase tracking-widest">
          Processing…
        </Text>
      )}

      {parsed && parsed.length > 0 && (
        <View className="gap-2">
          {parsed.map((p, i) => (
            <View
              key={i}
              className="flex-row items-center justify-between bg-surface rounded-lg px-3 py-2"
            >
              <Text className="text-text">{p.categoryName}</Text>
              <Text className="text-text font-semibold">
                {p.type === 'expense' ? '-' : '+'}
                {p.amount.toFixed(2)} {(p.currency ?? defaultCurrency).toUpperCase()}
              </Text>
            </View>
          ))}
          <Pressable
            onPress={commit}
            className="bg-accent rounded-lg py-3 items-center mt-1"
          >
            <Text className="text-background uppercase tracking-widest font-semibold">
              Save expenses
            </Text>
          </Pressable>
        </View>
      )}

      {parsed && parsed.length === 0 && (
        <Text className="text-text-muted text-center text-xs">
          Couldn't extract anything. Try again?
        </Text>
      )}
    </View>
  );
};
