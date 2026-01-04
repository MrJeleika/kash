import { Pressable, Text } from 'react-native';

interface CurrencyBadgeProps {
  currency: string;
  onPress?: () => void;
}

export function CurrencyBadge({ currency, onPress }: CurrencyBadgeProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-zinc-900 rounded-2xl px-5 py-3 active:opacity-70"
    >
      <Text className="text-white text-sm font-medium">
        {currency.toUpperCase()}
      </Text>
    </Pressable>
  );
}
