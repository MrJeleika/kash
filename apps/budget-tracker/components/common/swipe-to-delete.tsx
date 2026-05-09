import React, { useRef } from 'react';
import { Dimensions, Pressable, Text } from 'react-native';
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { Trash2 } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { C, FONTS } from '@/utils/theme';

const ACTION_WIDTH = 88;
const FULL_SWIPE_THRESHOLD = Dimensions.get('window').width * 0.45;

interface Props {
  onDelete: () => void;
  children: React.ReactNode;
  enabled?: boolean;
}

export const SwipeToDelete = ({ onDelete, children, enabled = true }: Props) => {
  const ref = useRef<SwipeableMethods>(null);
  const firedRef = useRef(false);

  if (!enabled) return <>{children}</>;

  const fireDelete = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    ref.current?.close();
    onDelete();
  };

  return (
    <ReanimatedSwipeable
      ref={ref}
      friction={2}
      rightThreshold={ACTION_WIDTH / 2}
      overshootRight
      overshootFriction={1}
      onSwipeableClose={() => {
        firedRef.current = false;
      }}
      renderRightActions={(_progress, translation) => (
        <RightAction
          translation={translation}
          onPress={fireDelete}
          onFullSwipe={fireDelete}
        />
      )}
    >
      {children}
    </ReanimatedSwipeable>
  );
};

const RightAction = ({
  translation,
  onPress,
  onFullSwipe,
}: {
  translation: SharedValue<number>;
  onPress: () => void;
  onFullSwipe: () => void;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const dragged = -translation.value;
    const width = Math.max(ACTION_WIDTH, dragged);
    return {
      width,
      transform: [
        {
          translateX: interpolate(
            translation.value,
            [-ACTION_WIDTH, 0],
            [0, ACTION_WIDTH],
            'clamp'
          ),
        },
      ],
    };
  });

  useAnimatedReaction(
    () => translation.value,
    (current, prev) => {
      if (prev === null) return;
      if (current <= -FULL_SWIPE_THRESHOLD && prev > -FULL_SWIPE_THRESHOLD) {
        runOnJS(onFullSwipe)();
      }
    }
  );

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        className="flex-1 items-center justify-center active:opacity-80"
        style={{ backgroundColor: C.red }}
      >
        <Icon icon={Trash2} size={18} color={C.textOnInk} strokeWidth={1.8} />
        <Text
          style={{
            fontFamily: FONTS.monoBold,
            fontSize: 10,
            lineHeight: 16,
            letterSpacing: 1.4,
            color: C.textOnInk,
            marginTop: 4,
          }}
        >
          DELETE
        </Text>
      </Pressable>
    </Animated.View>
  );
};
