import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

interface Props {
  voiceInputOpen: boolean;
}

export const TextRecognition = ({ voiceInputOpen }: Props) => {
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    if (voiceInputOpen) {
      setTranscript('');
    }
  }, [voiceInputOpen]);

  return (
    <View className="absolute bg-black rounded-xl min-h-[100px]  bottom-28 left-4 right-4">
      <Text className="text-white">{transcript}</Text>
    </View>
  );
};
