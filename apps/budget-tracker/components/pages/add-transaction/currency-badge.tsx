import { useCurrencyStore } from '@/store/currency';
import { Pressable } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';

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
      className="bg-dark-gray rounded-2xl flex items-center justify-center px-2 min-w-[60px] overflow-hidden"
    >
      <Animated.Text
        key={currency}
        entering={FadeInUp.duration(200)}
        exiting={FadeOutDown.duration(150)}
        className="text-white text-sm font-semibold"
      >
        {currency.toUpperCase()}
      </Animated.Text>
    </Pressable>
  );
}
