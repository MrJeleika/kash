import React, { useMemo, useEffect } from 'react';
import { View, Text, TextProps, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Layout,
} from 'react-native-reanimated';
import { TEXT_ANIMATION_CONFIG } from './animations.utils';
import { cn } from './utils';

interface AnimatedTextProps extends Omit<TextProps, 'children'> {
  children: string;
  suffix?: string;
  className?: string;
  isNumber?: boolean;
}

/**
 * Formats a stringified number with spaces as thousands separators.
 */
function formatNumberWithSpaces(value: string): string {
  if (!value) return value;
  const ignoreSpaces = value.replace(/\s/g, '');
  const [whole, decimal] = ignoreSpaces.split('.');
  const reversed = whole.split('').reverse();
  const grouped: string[] = [];
  for (let i = 0; i < reversed.length; i += 3) {
    grouped.push(
      reversed
        .slice(i, i + 3)
        .reverse()
        .join('')
    );
  }
  const formattedWhole = grouped.reverse().join(' ');
  return decimal ? `${formattedWhole}.${decimal}` : formattedWhole;
}

export function AnimatedText({
  children,
  suffix = '',
  className,
  style,
  isNumber = false,
  ...textProps
}: AnimatedTextProps) {
  const displayText = useMemo(
    () => (isNumber ? formatNumberWithSpaces(children) : children),
    [children, isNumber]
  );
  const firstCharShift = useSharedValue(0);

  useEffect(() => {
    firstCharShift.value = withTiming(
      displayText.length >= 4 ? -TEXT_ANIMATION_CONFIG.SLIDE_DISTANCE : 0,
      { duration: TEXT_ANIMATION_CONFIG.APPEAR_DURATION }
    );
  }, [displayText.length, firstCharShift]);

  const shiftStyle = useAnimatedStyle<ViewStyle>(() => ({
    transform: [{ translateX: firstCharShift.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {displayText.split('').map((char, index) => {
          const charElement = (
            <AnimatedChar
              key={`${char}-${index}-${displayText.length}`}
              char={char}
              style={style}
              className={className}
              textProps={textProps}
            />
          );

          return index === 0 ? (
            <Animated.View key={`shift-${index}`} style={shiftStyle}>
              {charElement}
            </Animated.View>
          ) : (
            charElement
          );
        })}
        {suffix && (
          <Text style={style} className={className} {...textProps}>
            {suffix}
          </Text>
        )}
      </View>
    </View>
  );
}

interface AnimatedCharProps {
  char: string;
  style?: TextProps['style'];
  className?: string;
  textProps: Omit<TextProps, 'children'>;
}

function AnimatedChar({
  char,
  style,
  className,
  textProps,
}: AnimatedCharProps) {
  return (
    <Animated.Text
      entering={FadeInDown.duration(TEXT_ANIMATION_CONFIG.APPEAR_DURATION)}
      exiting={FadeOutDown.duration(TEXT_ANIMATION_CONFIG.DISAPPEAR_DURATION)}
      layout={Layout.duration(TEXT_ANIMATION_CONFIG.APPEAR_DURATION)}
      style={style}
      className={cn(className)}
      {...textProps}
    >
      {char}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
