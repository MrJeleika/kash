import { Icon } from '@/components/ui/icon';
import { Star } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { C, FONTS } from '@/utils/theme';

interface CurrencyItemProps {
  currencyCode: string;
  currencyName: string;
  isFavorite: boolean;
  isSelected: boolean;
  onSelect: (code: string) => void;
  onToggleFavorite: (code: string) => void;
  isLast?: boolean;
}

export const CurrencyItem = memo(
  ({
    currencyCode,
    currencyName,
    isFavorite,
    isSelected,
    onSelect,
    onToggleFavorite,
    isLast,
  }: CurrencyItemProps) => {
    const code = currencyCode.toUpperCase();
    const tileText = code.slice(0, 3);
    const starOn = isFavorite || isSelected;

    return (
      <Pressable
        onPress={() => onSelect(currencyCode)}
        className="flex-row items-center gap-3 px-6 py-2 active:opacity-60"
        style={{
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: C.rule,
        }}
      >
        <View
          className="size-8 items-center justify-center"
          style={{
            backgroundColor: C.paper,
            borderWidth: 1,
            borderColor: C.rule,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.monoBold,
              fontSize: 10,
              lineHeight: 16,
              color: C.ink,
              letterSpacing: 0.5,
            }}
          >
            {tileText}
          </Text>
        </View>

        <View className="flex-1 flex-row items-baseline gap-2">
          <Text
            style={{
              fontFamily: FONTS.monoBold,
              fontSize: 12,
              lineHeight: 18,
              letterSpacing: 1.68,
              color: C.ink,
            }}
          >
            {code}
          </Text>
          <Text
            numberOfLines={1}
            className="flex-1"
            style={{
              fontFamily: FONTS.sansMedium,
              fontSize: 13,
              lineHeight: 18,
              color: C.text,
            }}
          >
            {currencyName}
          </Text>
          {isSelected && (
            <View className="px-1.5 py-px" style={{ backgroundColor: C.ink }}>
              <Text
                style={{
                  fontFamily: FONTS.monoBold,
                  fontSize: 8,
                  lineHeight: 14,
                  letterSpacing: 1.12,
                  color: C.textOnInk,
                }}
              >
                PRIMARY
              </Text>
            </View>
          )}
        </View>

        <Pressable
          onPress={() => onToggleFavorite(currencyCode)}
          hitSlop={10}
          className="active:opacity-50"
        >
          <Icon
            icon={Star}
            size={16}
            color={starOn ? C.red : C.textMute}
            fill={starOn ? C.red : 'transparent'}
            strokeWidth={1.4}
          />
        </Pressable>
      </Pressable>
    );
  }
);

CurrencyItem.displayName = 'CurrencyItem';
