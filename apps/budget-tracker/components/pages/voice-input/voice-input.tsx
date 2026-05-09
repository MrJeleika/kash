import { useModalsStore, VoiceState } from '@/store/modals';
import { Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  useDerivedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { TextRecognition } from './text-recognition';
import { C, FONTS } from '@/utils/theme';
import {
  AudioLines,
  Check,
  AlertTriangle,
  Mic,
  type LucideIcon,
} from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

let useSpeechRecognitionEvent: any = null;
try {
  useSpeechRecognitionEvent =
    require('expo-speech-recognition').useSpeechRecognitionEvent;
} catch {}

const VOICE_STATE_LABEL: Record<VoiceState, string> = {
  idle: 'Tap to speak',
  listening: 'Listening…',
  reviewing: 'Tap mic to add more',
  processing: 'Processing…',
  ready: 'Review · Tap to edit',
  empty: 'Nothing detected',
  error: 'Something went wrong',
};

const VOICE_STATE_HEADER: Record<VoiceState, string> = {
  idle: 'Voice · Idle',
  listening: 'Voice · Listening',
  reviewing: 'Voice · Review',
  processing: 'Voice · Processing',
  ready: 'Voice · Ready',
  empty: 'Voice · Empty',
  error: 'Voice · Error',
};

const VOICE_STATE_ICON: Record<VoiceState, LucideIcon> = {
  idle: Mic,
  listening: AudioLines,
  reviewing: Mic,
  processing: AudioLines,
  ready: Check,
  empty: Mic,
  error: AlertTriangle,
};

const ORB_SIZE = 84;

const Orb = ({ state }: { state: VoiceState }) => {
  const scale = useSharedValue(1);

  const isPulsing = state === 'listening' || state === 'idle';

  useEffect(() => {
    if (isPulsing) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.08, {
            duration: 700,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [isPulsing]);

  const halo1 = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * 1.4 }],
  }));
  const halo2 = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * 1.2 }],
  }));
  const core = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const IconComponent = VOICE_STATE_ICON[state];
  const dimmed = state === 'empty' || state === 'error';

  return (
    <View
      style={{
        width: ORB_SIZE,
        height: ORB_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: ORB_SIZE,
            height: ORB_SIZE,
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
            width: ORB_SIZE,
            height: ORB_SIZE,
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
            width: ORB_SIZE,
            height: ORB_SIZE,
            borderRadius: 999,
            backgroundColor: dimmed ? C.inkSoft : C.red,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: C.red,
            shadowOpacity: dimmed ? 0 : 0.6,
            shadowRadius: 22,
            shadowOffset: { width: 0, height: 0 },
            elevation: dimmed ? 0 : 10,
          },
          core,
        ]}
      >
        <Icon
          icon={IconComponent}
          size={28}
          color={C.textOnInk}
          strokeWidth={1.6}
        />
      </Animated.View>
    </View>
  );
};

const BAR_COUNT = 36;
const BAR_MIN = 4;
const BAR_MAX = 44;

const Bar = ({
  index,
  heights,
  active,
}: {
  index: number;
  heights: SharedValue<number[]>;
  active: boolean;
}) => {
  const target = useDerivedValue(() => heights.value[index] ?? BAR_MIN);
  const style = useAnimatedStyle(() => ({
    height: withTiming(target.value, { duration: 90, easing: Easing.out(Easing.quad) }),
  }));
  return (
    <Animated.View
      style={[
        {
          width: 3,
          borderRadius: 2,
          backgroundColor: active ? C.red : C.inkLine,
          opacity: active ? 1 : 0.45,
        },
        style,
      ]}
    />
  );
};

const Waveform = ({ active }: { active: boolean }) => {
  const heights = useSharedValue<number[]>(Array(BAR_COUNT).fill(BAR_MIN));

  if (useSpeechRecognitionEvent) {
    useSpeechRecognitionEvent('volumechange', (event: any) => {
      const v = typeof event?.value === 'number' ? event.value : -2;
      // value range is roughly -2..10; treat <=0 as silence
      const normalized = Math.max(0, Math.min(1, v / 10));
      const next = BAR_MIN + normalized * (BAR_MAX - BAR_MIN);
      const arr = heights.value.slice();
      arr.unshift(next);
      arr.length = BAR_COUNT;
      heights.value = arr;
    });
  }

  useEffect(() => {
    if (!active) {
      heights.value = Array(BAR_COUNT).fill(BAR_MIN);
    }
  }, [active]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: BAR_MAX,
        gap: 4,
      }}
    >
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <Bar key={i} index={i} heights={heights} active={active} />
      ))}
    </View>
  );
};

export const VoiceInput = () => {
  const { voiceInputOpen, voiceState, setVoiceState } = useModalsStore();

  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(voiceInputOpen ? 1 : 0, { duration: 280 });
    if (!voiceInputOpen) {
      setVoiceState('idle');
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
            lineHeight: 18,
            letterSpacing: 2.16,
            color: C.textOnInk,
            textTransform: 'uppercase',
          }}
        >
          {VOICE_STATE_HEADER[voiceState]}
        </Text>
        {voiceState === 'listening' && (
          <Text
            style={{
              fontFamily: FONTS.monoSemi,
              fontSize: 10,
              lineHeight: 16,
              letterSpacing: 1.4,
              color: C.red,
            }}
          >
            ● REC
          </Text>
        )}
      </View>

      {/* Orb */}
      <View className="items-center mt-10">
        <Orb state={voiceState} />
        <Text
          className="mt-3"
          style={{
            fontFamily: FONTS.monoSemi,
            fontSize: 10,
            lineHeight: 16,
            letterSpacing: 2,
            color: C.textOnInkDim,
            textTransform: 'uppercase',
          }}
        >
          {VOICE_STATE_LABEL[voiceState]}
        </Text>
      </View>

      {/* Waveform */}
      <View className="mt-6 px-6">
        <Waveform active={voiceState === 'listening'} />
      </View>

      {voiceInputOpen && <TextRecognition voiceInputOpen={voiceInputOpen} />}
    </Animated.View>
  );
};
