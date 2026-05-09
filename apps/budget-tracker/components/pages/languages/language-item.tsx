import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { C, FONTS } from '@/utils/theme';

interface LanguageItemProps {
  code: string;
  name: string;
  nativeName: string;
  isSelected: boolean;
  onSelect: (code: string) => void;
  isLast?: boolean;
}

export const LanguageItem = memo(
  ({ code, name, nativeName, isSelected, onSelect, isLast }: LanguageItemProps) => {
    const tag = code.split('-')[1] ?? code.toUpperCase();

    return (
      <Pressable
        onPress={() => onSelect(code)}
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
            {tag}
          </Text>
        </View>

        <View className="flex-1 flex-row items-baseline gap-2">
          <Text
            numberOfLines={1}
            style={{
              fontFamily: FONTS.sansMedium,
              fontSize: 13,
              lineHeight: 18,
              color: C.text,
            }}
          >
            {name}
          </Text>
          <Text
            numberOfLines={1}
            className="flex-1"
            style={{
              fontFamily: FONTS.sans,
              fontSize: 12,
              lineHeight: 18,
              color: C.textMuted,
            }}
          >
            {nativeName}
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
                ACTIVE
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  }
);

LanguageItem.displayName = 'LanguageItem';
