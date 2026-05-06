import { CATEGORY_COLORS } from '@/constants/category-colors';
import { View, ScrollView, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { C } from '@/utils/theme';

interface Props {
  color: string;
  setColor: (color: string) => void;
}

export const SelectColor = ({ color, setColor }: Props) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{
      paddingHorizontal: 24,
      paddingVertical: 4,
      gap: 8,
    }}
  >
    {CATEGORY_COLORS.map((opt) => {
      const isSelected = color === opt.hex;
      const isWhite = opt.hex.toLowerCase() === '#ffffff';
      return (
        <Pressable
          key={opt.hex}
          onPress={() => setColor(opt.hex)}
          className="active:opacity-80"
          style={{
            position: 'relative',
            width: 38,
            height: 38,
          }}
        >
          <View
            style={{
              width: 38,
              height: 38,
              backgroundColor: opt.hex,
              borderRadius: 4,
              borderWidth: isWhite ? 1 : 0,
              borderColor: C.rule,
            }}
          />
          {isSelected && (
            <>
              <View
                style={{
                  position: 'absolute',
                  inset: -4,
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: C.ink,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon
                  icon={Check}
                  size={16}
                  color={isWhite ? C.ink : '#ffffff'}
                  strokeWidth={2.4}
                />
              </View>
            </>
          )}
        </Pressable>
      );
    })}
  </ScrollView>
);
