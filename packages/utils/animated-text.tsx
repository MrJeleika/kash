import React, { useMemo } from 'react';
import { View, Text, TextProps, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutDown,
  Layout,
} from 'react-native-reanimated';
import { TEXT_ANIMATION_CONFIG } from './animations.utils';
import { formatNumberWithSpaces } from './text.utils';
import { cn } from './utils';

interface AnimatedTextProps extends Omit<TextProps, 'children'> {
  children: string;
  suffix?: string;
  className?: string;
  isNumber?: boolean;
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

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {displayText.split('').map((char, index) => (
          <AnimatedChar
            key={`${char}-${index}-${displayText.length}`}
            char={char}
            style={style}
            className={className}
            textProps={textProps}
          />
        ))}
        {suffix && (
          <Animated.Text
            entering={FadeInDown.duration(
              TEXT_ANIMATION_CONFIG.APPEAR_DURATION
            )}
            exiting={FadeOutDown.duration(
              TEXT_ANIMATION_CONFIG.DISAPPEAR_DURATION
            )}
            layout={Layout.duration(TEXT_ANIMATION_CONFIG.APPEAR_DURATION)}
            style={style}
            className={className}
            {...textProps}
          >
            {suffix}
          </Animated.Text>
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
  // Render spaces as regular text to avoid spacing issues
  if (char === ' ') {
    return (
      <Text style={style} className={cn(className)} {...textProps}>
        {char}
      </Text>
    );
  }

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
