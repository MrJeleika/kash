import { CategoryIcon } from '@/components/common/category-icon';
import { useCategoriesStore } from '@/store/categories';
import { useModalsStore } from '@/store/modals';
import { useTransactionsStore } from '@/store/transactions';
import { Transaction } from '@/types/transactions';
import { Text, View } from 'react-native';
import Animated, {
  FadeInUp,
  FadeOutDown,
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface TransactionItemProps {
  transaction: Transaction;
  index: number;
}

export const TransactionItem = ({
  transaction,
  index,
}: TransactionItemProps) => {
  const { getCategoryByName } = useCategoriesStore();
  const { setAddTransactionOpen, setTransactionToEdit } = useModalsStore();
  const { removeTransaction } = useTransactionsStore();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const category = getCategoryByName(transaction.categoryName);

  if (!category) {
    return null;
  }

  const isDifferentCurrency = transaction.currency !== transaction.baseCurrency;

  const handlePress = () => {
    setTransactionToEdit({
      ...transaction,
      amount: Math.abs(transaction.amount),
      amountInBaseCurrency: Math.abs(transaction.amountInBaseCurrency),
    });
    setAddTransactionOpen(true);
  };

  const singleTap = Gesture.Tap()
    .maxDuration(1000)
    .onStart(() => {
      scale.value = withTiming(0.95, { duration: 100 }, () => {
        scale.value = withTiming(1, { duration: 100 });
      });
      runOnJS(handlePress)();
    });

  return (
    <Animated.View
      entering={FadeInUp.duration(200).delay(index * 20)}
      exiting={FadeOutDown.duration(150)}
    >
      <GestureDetector gesture={singleTap}>
        <Animated.View
          style={animatedStyle}
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
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};
