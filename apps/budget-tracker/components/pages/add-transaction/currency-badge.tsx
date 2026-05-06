import { useCurrencyStore } from '@/store/currency';
import { Pressable } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { C, FONTS } from '@/utils/theme';

interface CurrencyBadgeProps {
  currency: string;
  setCurrency: (currency: string) => void;
}

export function CurrencyBadge({ currency, setCurrency }: CurrencyBadgeProps) {
  const { favoriteCurrencies } = useCurrencyStore();
  const handlePress = () => {
    const index = favoriteCurrencies.indexOf(currency);
    if (index === -1 || index === favoriteCurrencies.length - 1) {
      setCurrency(favoriteCurrencies[0]);
    } else {
      setCurrency(favoriteCurrencies[index + 1]);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className="items-center justify-center px-3 py-2.5 min-w-[60px]"
      style={{
        backgroundColor: C.paperHi,
        borderWidth: 1,
        borderColor: C.rule,
      }}
    >
      <Animated.Text
        key={currency}
        entering={FadeInUp.duration(200)}
        exiting={FadeOutDown.duration(150)}
        style={{
          fontFamily: FONTS.monoSemi,
          fontSize: 12,
          lineHeight: 18,
          letterSpacing: 1,
          color: C.text,
        }}
      >
        {currency?.toUpperCase()}
      </Animated.Text>
    </Pressable>
  );
}
