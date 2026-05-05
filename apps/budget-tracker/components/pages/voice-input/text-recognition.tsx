import { useTranscribeToTransactions } from '@/hooks/voice/useTranscribeToTransactions';
import { useTransactionsStore } from '@/store/transactions';
import { useCurrencyStore } from '@/store/currency';
import { useCategoriesStore } from '@/store/categories';
import { useModalsStore } from '@/store/modals';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { C, FONTS } from '@/utils/theme';

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
      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
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
    <View className="absolute left-0 right-0 px-6" style={{ top: 360, bottom: 130 }}>
      {/* Live transcript */}
      <Text
        style={{
          fontFamily: FONTS.monoSemi,
          fontSize: 10,
          letterSpacing: 1.4,
          color: C.textOnInkDim,
          textTransform: 'uppercase',
          marginBottom: 10,
        }}
      >
        —— Live transcript
      </Text>

      {error ? (
        <Text style={{ color: C.red, fontSize: 13 }}>Error: {error}</Text>
      ) : transcript ? (
        <Text
          style={{
            fontFamily: FONTS.serif,
            fontSize: 22,
            lineHeight: 30,
            color: C.textOnInk,
          }}
        >
          "{transcript}"
        </Text>
      ) : isRecognizing ? (
        <Text
          style={{
            fontFamily: FONTS.serifItalic,
            fontSize: 22,
            color: C.textOnInkDim,
          }}
        >
          Listening for your transaction…
        </Text>
      ) : null}

      {isPending && (
        <Text
          className="mt-3"
          style={{
            fontFamily: FONTS.monoSemi,
            fontSize: 10,
            letterSpacing: 1.4,
            color: C.textOnInkDim,
            textTransform: 'uppercase',
          }}
        >
          ● Processing · GPT-4o
        </Text>
      )}

      {/* Extracted preview */}
      {parsed && parsed.length > 0 && (
        <View
          className="mt-5 p-4"
          style={{
            backgroundColor: C.inkSoft,
            borderWidth: 1,
            borderColor: C.inkLine,
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <Text
              style={{
                fontFamily: FONTS.monoSemi,
                fontSize: 10,
                letterSpacing: 1.4,
                color: C.textOnInkDim,
                textTransform: 'uppercase',
              }}
            >
              Extracted · GPT-4o
            </Text>
            <Text
              style={{
                fontFamily: FONTS.monoSemi,
                fontSize: 10,
                color: C.red,
              }}
            >
              ● {parsed.length} item{parsed.length === 1 ? '' : 's'}
            </Text>
          </View>
          <View>
            {parsed.map((p, i) => (
              <View
                key={i}
                className="flex-row items-center justify-between py-2"
                style={{
                  borderTopWidth: i === 0 ? 0 : 1,
                  borderTopColor: C.inkLine,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.sansMedium,
                    fontSize: 13,
                    color: C.textOnInk,
                  }}
                >
                  {p.categoryName}
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.monoSemi,
                    fontSize: 14,
                    color: C.textOnInk,
                  }}
                >
                  {p.type === 'expense' ? '−' : '+'}
                  {p.amount.toFixed(2)}{' '}
                  {(p.currency ?? defaultCurrency).toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
          <Pressable
            onPress={commit}
            className="mt-3 h-11 items-center justify-center"
            style={{ backgroundColor: C.red }}
          >
            <Text
              style={{
                fontFamily: FONTS.monoBold,
                fontSize: 11,
                letterSpacing: 1.76,
                color: C.textOnInk,
                textTransform: 'uppercase',
              }}
            >
              Confirm & save
            </Text>
          </Pressable>
        </View>
      )}

      {parsed && parsed.length === 0 && (
        <Text
          className="mt-3 text-center"
          style={{
            fontFamily: FONTS.mono,
            fontSize: 12,
            color: C.textOnInkDim,
          }}
        >
          Couldn't extract anything. Try again?
        </Text>
      )}
    </View>
  );
};
