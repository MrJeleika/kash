import { Wallet } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { Icon } from '@/components/ui/icon';

interface WalletSelectorProps {
  walletName: string;
  amount: string;
  currency: string;
  onPress?: () => void;
}

export function WalletSelector({
  walletName,
  amount,
  currency,
  onPress,
}: WalletSelectorProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center bg-zinc-900 rounded-2xl px-4 py-3 active:opacity-70"
    >
      <View className="bg-green/20 rounded-full p-2 mr-3">
        <Icon icon={Wallet} className="text-green" size={20} />
      </View>
      <View className="flex-1">
        <Text className="text-white text-sm font-medium">{walletName}</Text>
        <Text className="text-secondary-text text-xs">
          -{amount} {currency.toUpperCase()}
        </Text>
      </View>
    </Pressable>
  );
}
