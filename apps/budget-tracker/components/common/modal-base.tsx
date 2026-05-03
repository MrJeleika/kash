import { cn } from '@/utils/shared';
import { useEffect, useImperativeHandle, forwardRef } from 'react';
import { Dimensions, Platform, Pressable, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.95; // 95% of screen height
const MAX_TRANSLATE_Y = -BOTTOM_SHEET_HEIGHT;
const MIN_TRANSLATE_Y = 0;

interface ModalBaseProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export interface ModalBaseRef {
  close: () => void;
}

export const ModalBase = forwardRef<ModalBaseRef, ModalBaseProps>(
  function ModalBase({ children, isOpen, onClose, className }, ref) {
    const translateY = useSharedValue(0);
    const context = useSharedValue({ y: 0 });
    const opacity = useSharedValue(0);

    useEffect(() => {
      if (isOpen) {
        translateY.value = withTiming(MAX_TRANSLATE_Y, { duration: 300 });
        opacity.value = withTiming(1, { duration: 300 });
      } else {
        translateY.value = MIN_TRANSLATE_Y;
        opacity.value = withTiming(0, { duration: 300 });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleClose = () => {
      translateY.value = withTiming(MIN_TRANSLATE_Y, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(onClose)();
      });
    };

    useImperativeHandle(ref, () => ({
      close: handleClose,
    }));

    const rBackdropStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
      };
    });

    const rBottomSheetStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: translateY.value }],
      };
    });

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        const newTranslateY = context.value.y + event.translationY;
        translateY.value = Math.max(
          MAX_TRANSLATE_Y,
          Math.min(MIN_TRANSLATE_Y, newTranslateY)
        );
      })
      .onEnd((event) => {
        const shouldClose = event.translationY > 100 || event.velocityY > 500;
        if (shouldClose) {
          translateY.value = withTiming(MIN_TRANSLATE_Y, { duration: 300 });
          opacity.value = withTiming(0, { duration: 300 }, () => {
            runOnJS(onClose)();
          });
        } else {
          translateY.value = withTiming(MAX_TRANSLATE_Y, { duration: 300 });
        }
      });

    if (!isOpen) return null;

    return (
      <GestureHandlerRootView className="absolute inset-0 z-[1000]">
        <Pressable onPress={handleClose} className="flex-1">
          <Animated.View
            className="absolute inset-0 bg-[#c2b9a7]/50"
            style={rBackdropStyle}
          />
        </Pressable>
        <GestureDetector gesture={gesture}>
          <Animated.View
            className="absolute w-full bg-[#c2b9a7] rounded-t-3xl"
            style={[
              {
                height: BOTTOM_SHEET_HEIGHT,
                top: SCREEN_HEIGHT,
                paddingTop: Platform.OS === 'ios' ? 12 : 0,
              },
              rBottomSheetStyle,
            ]}
          >
            <View className={cn('flex-1 px-4 relative', className)}>
              {children}
            </View>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    );
  }
);
