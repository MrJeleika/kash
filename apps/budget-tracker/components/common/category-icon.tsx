import { Category } from '@/types/categories';
import { Icon } from '../ui/icon';
import { StyleProp, ViewStyle } from 'react-native';
import { reduceColorSaturation } from '@/utils/colors';
import React from 'react';
import Animated, { AnimatedStyle } from 'react-native-reanimated';

interface CategoryIconProps {
  category: Category;
  className?: string;
  style?: StyleProp<ViewStyle> | AnimatedStyle<ViewStyle>;
}

export const CategoryIcon = React.forwardRef<
  React.ComponentRef<typeof Animated.View>,
  CategoryIconProps
>(({ category, className, style }, ref) => {
  return (
    <Animated.View
      ref={ref}
      style={[
        {
          backgroundColor: reduceColorSaturation(category.color),
          width: 40,
          height: 40,
          borderRadius: 6,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      <Icon icon={category.icon} size={24} color={category.color} />
    </Animated.View>
  );
});

CategoryIcon.displayName = 'CategoryIcon';
