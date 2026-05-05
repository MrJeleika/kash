import { useModalsStore } from '@/store/modals';
import { Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { TextRecognition } from './text-recognition';
import { C, FONTS } from '@/utils/theme';
import { AudioLines } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

const Orb = () => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const halo1 = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * 1.4 }],
  }));
  const halo2 = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * 1.2 }],
  }));
  const core = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View
      style={{
        width: 130,
        height: 130,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 130,
            height: 130,
            borderRadius: 999,
            backgroundColor: C.red,
            opacity: 0.15,
          },
          halo1,
        ]}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 130,
            height: 130,
            borderRadius: 999,
            backgroundColor: C.red,
            opacity: 0.25,
          },
          halo2,
        ]}
      />
      <Animated.View
        style={[
          {
            width: 130,
            height: 130,
            borderRadius: 999,
            backgroundColor: C.red,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: C.red,
            shadowOpacity: 0.6,
            shadowRadius: 30,
            shadowOffset: { width: 0, height: 0 },
            elevation: 12,
          },
          core,
        ]}
      >
        <Icon icon={AudioLines} size={42} color={C.textOnInk} strokeWidth={1.6} />
      </Animated.View>
    </View>
  );
};

export const VoiceInput = () => {
  const { voiceInputOpen } = useModalsStore();

  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(voiceInputOpen ? 1 : 0, { duration: 280 });
  }, [voiceInputOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!voiceInputOpen && opacity.value === 0) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents={voiceInputOpen ? 'auto' : 'none'}
      className="absolute inset-0 z-10"
      style={[animatedStyle, { backgroundColor: C.ink }]}
    >
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-6 pt-16 pb-4"
        style={{ borderBottomWidth: 1, borderBottomColor: C.inkLine }}
      >
        <Text
          style={{
            fontFamily: FONTS.monoBold,
            fontSize: 12,
            letterSpacing: 2.16,
            color: C.textOnInk,
            textTransform: 'uppercase',
          }}
        >
          Voice · Listening
        </Text>
        <Text
          style={{
            fontFamily: FONTS.monoSemi,
            fontSize: 10,
            letterSpacing: 1.4,
            color: C.red,
          }}
        >
          ● REC
        </Text>
      </View>

      {/* Orb */}
      <View className="items-center mt-12">
        <Orb />
        <Text
          className="mt-4"
          style={{
            fontFamily: FONTS.monoSemi,
            fontSize: 10,
            letterSpacing: 2,
            color: C.textOnInkDim,
            textTransform: 'uppercase',
          }}
        >
          Listening…
        </Text>
      </View>

      {voiceInputOpen && <TextRecognition voiceInputOpen={voiceInputOpen} />}
    </Animated.View>
  );
};
