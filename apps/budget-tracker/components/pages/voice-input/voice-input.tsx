import { useModalsStore } from '@/store/modals';
import { cn } from '@MrJeleika/utils';
import { Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { BlurView } from 'expo-blur';
import { TextRecognition } from './text-recognition';

export const VoiceInput = () => {
  const { voiceInputOpen, setVoiceInputOpen } = useModalsStore();

  const opacity = useSharedValue(0);

  useEffect(() => {
    if (voiceInputOpen) {
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [voiceInputOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!voiceInputOpen && opacity.value === 0) {
    return null;
  }

  return (
    <Animated.View
      className={cn(
        'h-screen w-screen absolute inset-0 z-10 pointer-events-none'
      )}
      style={animatedStyle}
    >
      <BlurView
        intensity={20}
        tint="light"
        className="h-full w-full pointer-events-none"
      >
        <TextRecognition voiceInputOpen={voiceInputOpen} />
      </BlurView>
    </Animated.View>
  );
};
