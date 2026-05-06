import { Pressable, Alert, View } from 'react-native';
import { AudioLines, Plus, ScanText } from 'lucide-react-native';
import { useModalsStore } from '@/store/modals';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloseButton } from '@/components/common/close-button';
import { useOcrReceipt } from '@/hooks/photo/useOcrReceipt';
import { captureReceipt } from '@/utils/photo';
import { C } from '@/utils/theme';

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

export function ActionButtons() {
  const {
    setAddTransactionOpen,
    setVoiceInputOpen,
    voiceInputOpen,
    setTransactionDraft,
  } = useModalsStore();
  const ocr = useOcrReceipt();
  const insets = useSafeAreaInsets();

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
    try {
      const uri = await captureReceipt();
      if (!uri) return;
      const result = await ocr.mutateAsync({ uri });
      const tx = result.transaction;
      const amount = Math.abs(tx.amount || 0);
      setTransactionDraft({
        type: tx.type,
        amount,
        amountInBaseCurrency: amount,
        currency: tx.currency || undefined,
        merchant: tx.merchant || undefined,
        date: tx.date || new Date().toISOString().split('T')[0],
        categoryName: tx.categoryName || undefined,
        baseCurrency: undefined,
        inputMethod: 'photo',
      });
      setAddTransactionOpen(true);
    } catch (err: any) {
      const msg =
        err?.status === 429
          ? 'Monthly limit reached. Try again next month.'
          : err?.message || 'Could not read receipt.';
      Alert.alert('Receipt scan', msg);
    }
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
          disabled={ocr.isPending}
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
          onPress={() => setVoiceInputOpen(true)}
        >
          <View className="size-[22px]" style={{ backgroundColor: C.paper }} />
        </Pressable>
      </Animated.View>

      <Animated.View className="absolute" style={voiceCloseButtonStyle}>
        <CloseButton onPress={() => setVoiceInputOpen(false)} />
      </Animated.View>
    </View>
  );
}
