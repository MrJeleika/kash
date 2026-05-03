import { Icon } from '@/components/ui/icon';
import { cn } from '@/utils/shared';
import { Heart } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, Text } from 'react-native';

interface CurrencyItemProps {
  currencyCode: string;
  currencyName: string;
  isFavorite: boolean;
  isSelected: boolean;
  onClick: () => void;
  onFavoriteClick: () => void;
}

export const CurrencyItem = memo(
  ({
    currencyCode,
    currencyName,
    isFavorite,
    isSelected,
    onClick,
    onFavoriteClick,
  }: CurrencyItemProps) => {
    const textColor = isSelected ? 'text-background' : 'text-text';
    const iconFill = isFavorite ? (isSelected ? '#D6D1C4' : '#CC2200') : undefined;
    const iconColor = isSelected ? 'text-background' : 'text-accent';
    const iconFillClass = isFavorite
      ? isSelected
        ? 'fill-background'
        : 'fill-accent'
      : '';

    return (
      <Pressable
        onPress={onClick}
        className={cn(
          'flex items-center flex-row gap-3 px-3 py-2 rounded-xl',
          isSelected ? 'bg-primary' : 'bg-surface'
        )}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Pressable
          onPress={onFavoriteClick}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Icon
            icon={Heart}
            fill={iconFill}
            className={cn(iconColor, iconFillClass)}
          />
        </Pressable>
        <Text
          className={cn('text-semibold uppercase', textColor)}
          style={{ flexShrink: 0 }}
          ellipsizeMode="clip"
        >
          {currencyCode}
        </Text>
        <Text
          className={cn('flex-1', textColor)}
          numberOfLines={1}
          ellipsizeMode="clip"
        >
          {currencyName}
        </Text>
      </Pressable>
    );
  }
);

CurrencyItem.displayName = 'CurrencyItem';
