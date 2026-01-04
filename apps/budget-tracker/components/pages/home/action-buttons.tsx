import { Button } from '@/components/ui/button/button';
import { View } from 'react-native';
import { AudioLines, Plus, ScanText } from 'lucide-react-native';
import { useModalsStore } from '@/store/modals';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { CloseButton } from '@/components/common/close-button';

export function ActionButtons() {
  const { setAddTransactionOpen, setVoiceInputOpen, voiceInputOpen } =
    useModalsStore();

  const scanTextButtonScale = useSharedValue(1);
  const addTransactionButtonScale = useSharedValue(1);
  const voiceButtonScale = useSharedValue(1);

  const closeButtonTranslateX = useSharedValue(70);
  const closeButtonScale = useSharedValue(0);
  const voiceActiveButtonScale = useSharedValue(0.8);
  const voiceActiveButtonOpacity = useSharedValue(0);
  const voiceActiveButtonTranslateX = useSharedValue(75);

  useEffect(() => {
    if (voiceInputOpen) {
      scanTextButtonScale.value = withTiming(0, { duration: 200 });
      addTransactionButtonScale.value = withTiming(0, { duration: 200 });
      voiceButtonScale.value = withTiming(0, { duration: 300 });
      // Show close button at original voice button position
      closeButtonTranslateX.value = withTiming(70, { duration: 300 });
      closeButtonScale.value = withTiming(1, { duration: 300 });
      voiceActiveButtonScale.value = withTiming(1, { duration: 300 });
      voiceActiveButtonOpacity.value = withTiming(1, { duration: 300 });
      voiceActiveButtonTranslateX.value = withTiming(0, { duration: 300 });
    } else {
      scanTextButtonScale.value = withTiming(1, { duration: 200 });
      addTransactionButtonScale.value = withTiming(1, { duration: 200 });
      voiceButtonScale.value = withTiming(1, { duration: 300 });
      // Hide close button
      closeButtonTranslateX.value = withTiming(70, { duration: 300 });
      closeButtonScale.value = withTiming(0, { duration: 300 });
      voiceActiveButtonScale.value = withTiming(0.8, { duration: 300 });
      voiceActiveButtonOpacity.value = withTiming(0, { duration: 300 });
      voiceActiveButtonTranslateX.value = withTiming(75, { duration: 300 });
    }
  }, [voiceInputOpen]);

  const scanTextButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scanTextButtonScale.value }],
  }));

  const addTransactionButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addTransactionButtonScale.value }],
  }));

  const voiceButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: voiceButtonScale.value }],
  }));

  const voiceCloseButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: closeButtonScale.value },
      { translateX: closeButtonTranslateX.value },
    ],
  }));

  const voiceActiveButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: voiceActiveButtonScale.value },
      { translateX: voiceActiveButtonTranslateX.value },
    ],
    opacity: voiceActiveButtonOpacity.value,
  }));

  return (
    <View className="absolute bottom-5 flex flex-row gap-5 justify-center items-center left-1/2 -translate-x-1/2 z-50">
      <Animated.View style={scanTextButtonStyle}>
        <Button className="size-[50px] rounded-full">
          <ScanText className="size-[35px]" strokeWidth={1.5} />
        </Button>
      </Animated.View>
      <Animated.View style={addTransactionButtonStyle}>
        <Button
          className="size-[60px] rounded-full"
          onPress={() => setAddTransactionOpen(true)}
        >
          <Plus size={30} strokeWidth={1.5} />
        </Button>
      </Animated.View>
      <Animated.View style={voiceButtonStyle}>
        <Button
          className="size-[50px] rounded-full"
          onPress={() => setVoiceInputOpen(true)}
        >
          <AudioLines className="size-[35px]" strokeWidth={1.5} />
        </Button>
      </Animated.View>
      <Animated.View className={'absolute'} style={voiceActiveButtonStyle}>
        <Button
          className="size-[60px] rounded-full"
          onPress={() => setVoiceInputOpen(true)}
        >
          <View className="size-[25px] bg-black"></View>
        </Button>
      </Animated.View>
      <Animated.View className={'absolute'} style={voiceCloseButtonStyle}>
        <CloseButton onPress={() => setVoiceInputOpen(false)} />
      </Animated.View>
    </View>
  );
}
