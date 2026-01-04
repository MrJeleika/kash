import { useCurrencyStore } from '@/store/currency';
import { formatNumberWithSpaces } from '@MrJeleika/utils';
import { Text, View } from 'react-native';
import { PeriodSelectorTrigger } from '../period-selector/period-selector-trigger';
import { GroupedTransaction } from '@/utils/transactions';

interface Props {
  groupedTransactions: GroupedTransaction[];
}

export const TotalSpent = ({ groupedTransactions }: Props) => {
  const totalSpent = groupedTransactions.reduce(
    (acc, group) => acc + group.total,
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
