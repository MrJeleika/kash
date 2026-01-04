import { CategoryIcon } from '@/components/common/category-icon';
import { useCategoriesStore } from '@/store/categories';
import { useModalsStore } from '@/store/modals';
import { Transaction } from '@/types/transactions';
import { Pressable, Text, View } from 'react-native';

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const { getCategoryByName } = useCategoriesStore();
  const { setAddTransactionOpen, setTransactionToEdit } = useModalsStore();
  const category = getCategoryByName(transaction.categoryName);

  if (!category) {
    return null;
  }

  const isDifferentCurrency = transaction.currency !== transaction.baseCurrency;

  return (
    <Pressable
      onPress={() => {
        setTransactionToEdit({
          ...transaction,
          amount: Math.abs(transaction.amount),
          amountInBaseCurrency: Math.abs(transaction.amountInBaseCurrency),
        });
        setAddTransactionOpen(true);
      }}
      className="flex flex-row items-center justify-between rounded-xl bg-dark-gray p-2"
    >
      <View className="flex flex-row items-center gap-2">
        <CategoryIcon category={category} />
        <Text className="text-white font-medium">
          {transaction.categoryName}
        </Text>
      </View>
      <View className="flex flex-col gap-1">
        <Text className="text-white">
          {transaction.amountInBaseCurrency}{' '}
          {transaction.baseCurrency?.toUpperCase()}
        </Text>
        {isDifferentCurrency && (
          <Text className="text-secondary-text text-sm text-right">
            {transaction.amount} {transaction.currency?.toUpperCase()}
          </Text>
        )}
      </View>
    </Pressable>
  );
};
