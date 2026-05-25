import { Pressable, View } from 'react-native';
import {
  AudioLines,
  Plus,
  ScanText,
  Square,
  Loader2,
  Check,
  AlertTriangle,
  Mic,
} from 'lucide-react-native';
import { useModalsStore } from '@/store/modals';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloseButton } from '@/components/common/close-button';
import { captureReceipt } from '@/utils/photo';
import { C } from '@/utils/theme';
import { Icon } from '@/components/ui/icon';

const sideButtonStyle = {
  backgroundColor: C.ink,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.18,
  shadowRadius: 14,
  elevation: 6,
};

const fabStyle = {
  backgroundColor: C.red,
  shadowColor: C.red,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.45,
  shadowRadius: 20,
  elevation: 10,
};

const VOICE_BUTTON_ICON = {
  idle: Mic,
  listening: Square,
  reviewing: Mic,
  processing: Loader2,
  ready: Check,
  empty: AudioLines,
  error: AlertTriangle,
} as const;

export function ActionButtons() {
  const {
    setAddTransactionOpen,
    setVoiceInputOpen,
    voiceInputOpen,
    voiceState,
    voiceStopHandler,
    openPhotoInput,
  } = useModalsStore();
  const insets = useSafeAreaInsets();
  const ActionIcon = VOICE_BUTTON_ICON[voiceState];
  const iconSpin = useSharedValue(0);

  useEffect(() => {
    if (voiceState === 'processing') {
      iconSpin.value = 0;
      iconSpin.value = withRepeat(
        withTiming(360, { duration: 900, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      iconSpin.value = withTiming(0, { duration: 150 });
    }
  }, [voiceState]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconSpin.value}deg` }],
  }));

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
      closeButtonTranslateX.value = withTiming(70, { duration: 300 });
      closeButtonScale.value = withTiming(1, { duration: 300 });
      voiceActiveButtonScale.value = withTiming(1, { duration: 300 });
      voiceActiveButtonOpacity.value = withTiming(1, { duration: 300 });
      voiceActiveButtonTranslateX.value = withTiming(0, { duration: 300 });
    } else {
      scanTextButtonScale.value = withTiming(1, { duration: 200 });
      addTransactionButtonScale.value = withTiming(1, { duration: 200 });
      voiceButtonScale.value = withTiming(1, { duration: 300 });
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

  const handlePhoto = async () => {
    const uri = await captureReceipt();
    if (!uri) return;
    openPhotoInput(uri);
  };

  return (
    <View
      className="absolute left-0 right-0 flex flex-row gap-4 justify-center items-center z-50"
      style={{ bottom: insets.bottom + 4 }}
      pointerEvents="box-none"
    >
      <Animated.View style={scanTextButtonStyle}>
        <Pressable
          className="size-[52px] rounded-full items-center justify-center active:opacity-70"
          style={sideButtonStyle}
          onPress={handlePhoto}
        >
          <ScanText size={20} color={C.textOnInk} strokeWidth={1.6} />
        </Pressable>
      </Animated.View>

      <Animated.View style={addTransactionButtonStyle}>
        <Pressable
          className="size-[64px] rounded-full items-center justify-center active:opacity-80"
          style={fabStyle}
          onPress={() => setAddTransactionOpen(true)}
        >
          <Plus size={26} color={C.textOnInk} strokeWidth={2} />
        </Pressable>
      </Animated.View>

      <Animated.View style={voiceButtonStyle}>
        <Pressable
          className="size-[52px] rounded-full items-center justify-center active:opacity-70"
          style={sideButtonStyle}
          onPress={() => setVoiceInputOpen(true)}
        >
          <AudioLines size={20} color={C.textOnInk} strokeWidth={1.6} />
        </Pressable>
      </Animated.View>

      <Animated.View className="absolute" style={voiceActiveButtonStyle}>
        <Pressable
          className="size-[64px] rounded-full items-center justify-center active:opacity-80"
          style={fabStyle}
          onPress={() => {
            if (
              (voiceState === 'listening' || voiceState === 'reviewing') &&
              voiceStopHandler
            ) {
              voiceStopHandler();
            }
          }}
        >
          <Animated.View style={iconStyle}>
            <Icon
              icon={ActionIcon}
              size={26}
              color={C.textOnInk}
              strokeWidth={1.8}
            />
          </Animated.View>
        </Pressable>
      </Animated.View>

      <Animated.View className="absolute" style={voiceCloseButtonStyle}>
        <CloseButton onPress={() => setVoiceInputOpen(false)} />
      </Animated.View>
    </View>
  );
}
