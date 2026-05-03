import { Category } from '@/types/categories';
import { Icon } from '../ui/icon';
import { StyleProp, ViewStyle } from 'react-native';
import { reduceColorSaturation } from '@/utils/colors';
import React from 'react';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { getIconByName } from '@/utils/icon-registry';

interface CategoryIconProps {
  category: Category;
  className?: string;
  style?: StyleProp<ViewStyle> | AnimatedStyle<ViewStyle>;
  size?: number;
}

export const CategoryIcon = React.forwardRef<
  React.ComponentRef<typeof Animated.View>,
  CategoryIconProps
>(({ category, className, style, size = 40 }, ref) => {
  const iconComponent = getIconByName(category.icon);

  return (
    <Animated.View
      ref={ref}
      style={[
        {
          backgroundColor: reduceColorSaturation(category.color),
          width: size,
          height: size,
          borderRadius: 6,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      <Icon icon={iconComponent} size={size * 0.6} color={category.color} />
    </Animated.View>
  );
});

CategoryIcon.displayName = 'CategoryIcon';
