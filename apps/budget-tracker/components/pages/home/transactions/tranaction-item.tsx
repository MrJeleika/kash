import { Transaction } from '@/types/transactions';
import { Text, View } from 'react-native';

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
  return (
    <View className="flex flex-row items-center justify-between rounded-xl bg-dark-gray p-4">
      <View className="flex flex-row items-center gap-1">
        <Text className="text-white">{transaction.categoryName}</Text>
      </View>
      <View className="flex flex-col gap-1">
        <Text className="text-white">{transaction.amount}</Text>
        <Text className="text-white">{transaction.amount}</Text>
      </View>
    </View>
  );
};
