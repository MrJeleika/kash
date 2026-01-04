import { useTranscribeToTransactions } from '@/hooks/voice/useTranscribeToTransactions';
import { useEffect, useState } from 'react';
import { Text, View, Button, TouchableOpacity } from 'react-native';

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

// Mock transcripts for testing without native module
const MOCK_TRANSCRIPTS = [
  'Spent 50 dollars on groceries',
  'Paid 20 for lunch at restaurant',
  'Received 100 from salary',
  'Coffee 5 dollars',
];

export const TextRecognition = ({ voiceInputOpen }: Props) => {
  const { mutateAsync: transcribeToTransactions } =
    useTranscribeToTransactions();

  const [transcript, setTranscript] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMockMode = !ExpoSpeechRecognitionModule;

  const handleStart = async () => {
    setError(null);

    // Mock mode for development without native module
    if (isMockMode) {
      setIsRecognizing(true);
      const mockTranscript =
        MOCK_TRANSCRIPTS[Math.floor(Math.random() * MOCK_TRANSCRIPTS.length)];

      // Simulate gradual text appearance
      let currentText = '';
      for (let i = 0; i < mockTranscript.length; i++) {
        setTimeout(() => {
          currentText += mockTranscript[i];
          setTranscript(currentText);
        }, i * 50);
      }

      const transactions = await transcribeToTransactions(mockTranscript);
      console.log('transactions', transactions);

      setTimeout(() => {
        setIsRecognizing(false);
      }, mockTranscript.length * 50 + 500);
      return;
    }

    // Real speech recognition
    try {
      const result =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        setError('Permissions not granted');
        console.warn('Permissions not granted', result);
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
      console.error('Speech recognition error:', err);
      setIsRecognizing(false);
    }
  };

  // Only use event listener if module is available
  if (useSpeechRecognitionEvent) {
    useSpeechRecognitionEvent('result', (event: any) => {
      setTranscript(event.results[0]?.transcript || '');
    });

    useSpeechRecognitionEvent('end', () => {
      setIsRecognizing(false);
    });

    useSpeechRecognitionEvent('error', (event: any) => {
      setError(event.error);
      setIsRecognizing(false);
    });
  }

  useEffect(() => {
    if (voiceInputOpen) {
      setTranscript('');
      setError(null);
      handleStart();
    } else {
      setIsRecognizing(false);
    }
  }, [voiceInputOpen]);

  return (
    <View className="absolute flex flex-col items-center justify-center bg-black rounded-xl min-h-[100px] bottom-28 left-4 right-4 p-4">
      {error && (
        <Text className="text-red-400 text-sm mb-2">Error: {error}</Text>
      )}

      {isRecognizing && !transcript && (
        <Text className="text-secondary-text italic">Listening...</Text>
      )}

      <Text className="text-secondary-text flex items-center justify-center text-center">
        {transcript}
      </Text>
    </View>
  );
};
