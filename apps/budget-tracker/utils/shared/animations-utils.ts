import { withTiming, Easing, SharedValue } from 'react-native-reanimated';

/**
 * Animation configuration constants for text typing animations
 */
export const TEXT_ANIMATION_CONFIG = {
  SLIDE_DISTANCE: 4, // pixels - minimal slide distance
  APPEAR_DURATION: 200, // milliseconds
  DISAPPEAR_DURATION: 150, // milliseconds
} as const;

/**
 * Animation timing configuration for text appearance
 * Character slides down from top (4px) and fades in
 */
export const textAppearConfig = {
  duration: TEXT_ANIMATION_CONFIG.APPEAR_DURATION,
  easing: Easing.out(Easing.ease),
};

/**
 * Animation timing configuration for text disappearance
 * Character slides down (4px) and fades out
 */
export const textDisappearConfig = {
  duration: TEXT_ANIMATION_CONFIG.DISAPPEAR_DURATION,
  easing: Easing.in(Easing.ease),
};

/**
 * Animates a shared value for text character appearance
 * When typing: character appears from top (-4px) sliding down to position (0px) with fade in
 * @param opacityValue - Shared value for opacity (0 to 1)
 * @param translateYValue - Shared value for translateY (-4 to 0)
 * @param isVisible - Whether the character should be visible
 */
export function animateTextAppear(
  opacityValue: SharedValue<number>,
  translateYValue: SharedValue<number>,
  isVisible: boolean
): void {
  if (isVisible) {
    opacityValue.value = withTiming(1, textAppearConfig);
    translateYValue.value = withTiming(0, textAppearConfig);
  } else {
    opacityValue.value = withTiming(0, textAppearConfig);
    translateYValue.value = withTiming(
      -TEXT_ANIMATION_CONFIG.SLIDE_DISTANCE,
      textAppearConfig
    );
  }
}

/**
 * Animates a shared value for text character disappearance
 * When deleting: character slides down (4px) and fades out
 * @param opacityValue - Shared value for opacity (1 to 0)
 * @param translateYValue - Shared value for translateY (0 to 4)
 * @param isVisible - Whether the character should be visible
 */
export function animateTextDisappear(
  opacityValue: SharedValue<number>,
  translateYValue: SharedValue<number>,
  isVisible: boolean
): void {
  if (isVisible) {
    opacityValue.value = withTiming(1, textDisappearConfig);
    translateYValue.value = withTiming(0, textDisappearConfig);
  } else {
    opacityValue.value = withTiming(0, textDisappearConfig);
    translateYValue.value = withTiming(
      TEXT_ANIMATION_CONFIG.SLIDE_DISTANCE,
      textDisappearConfig
    );
  }
}
