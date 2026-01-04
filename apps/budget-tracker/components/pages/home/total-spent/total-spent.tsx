import { useCurrencyStore } from '@/store/currency';
import { useTransactionsStore } from '@/store/transactions';
import { formatNumberWithSpaces } from '@MrJeleika/utils';
import { Text, View } from 'react-native';
import { PeriodSelectorTrigger } from '../period-selector/period-selector-trigger';

export const TotalSpent = () => {
  const { transactions } = useTransactionsStore();
  const totalSpent = transactions.reduce(
    (acc, transaction) => acc + transaction.amountInBaseCurrency,
    0
  );
  const { currency: defaultCurrency } = useCurrencyStore();
  return (
    <View className="flex flex-col gap-3 min-h-[12vh]">
      <View className="flex items-center justify-center flex-row gap-2">
        <Text className="text-secondary-text text-sm">Expenses for </Text>
        <PeriodSelectorTrigger />
      </View>
      <Text className="text-white text-4xl font-bold text-center">
        {formatNumberWithSpaces(totalSpent.toString())}{' '}
        {defaultCurrency?.toUpperCase()}
      </Text>
    </View>
  );
};
