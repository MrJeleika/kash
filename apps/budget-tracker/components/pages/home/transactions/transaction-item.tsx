import { useCategoriesStore } from '@/store/categories';
import { useModalsStore } from '@/store/modals';
import { Transaction } from '@/types/transactions';
import { formatTime } from '@/utils/format/dates';
import { formatNumberWithSpaces } from '@MrJeleika/utils';
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
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const category = getCategoryByName(transaction.categoryName);
  if (!category) return null;

  const isExpense = transaction.type === 'expense';
  const isDifferentCurrency = transaction.currency !== transaction.baseCurrency;
  const sign = isExpense ? '-' : '+';
  const amountStr = formatNumberWithSpaces(
    Math.abs(transaction.amountInBaseCurrency).toFixed(2)
  );
  const title = transaction.merchant || transaction.categoryName;

  const handlePress = () => {
    setTransactionToEdit({
      ...transaction,
      amount: Math.abs(transaction.amount),
      amountInBaseCurrency: Math.abs(transaction.amountInBaseCurrency),
    });
    setAddTransactionOpen(true);
  };

  const tap = Gesture.Tap()
    .maxDuration(1000)
    .onStart(() => {
      scale.value = withTiming(0.97, { duration: 80 }, () => {
        scale.value = withTiming(1, { duration: 100 });
      });
      runOnJS(handlePress)();
    });

  return (
    <Animated.View
      entering={FadeInUp.duration(200).delay(index * 20)}
      exiting={FadeOutDown.duration(150)}
    >
      <GestureDetector gesture={tap}>
        <Animated.View
          style={animatedStyle}
          className="flex-row items-center justify-between rounded-xl bg-surface px-3 py-3"
        >
          <View className="flex-row items-center gap-3 flex-1">
            <View
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <View className="flex-1">
              <Text
                className="text-text font-medium"
                numberOfLines={1}
              >
                {title}
              </Text>
              <Text className="text-text-muted text-xs">
                {formatTime(transaction.date)}
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Text
              className={
                isExpense ? 'text-text font-semibold' : 'text-text font-semibold'
              }
            >
              {sign}
              {amountStr} {transaction.baseCurrency?.toUpperCase()}
            </Text>
            {isDifferentCurrency && (
              <Text className="text-text-muted text-xs">
                {sign}
                {formatNumberWithSpaces(
                  Math.abs(transaction.amount).toFixed(2)
                )}{' '}
                {transaction.currency?.toUpperCase()}
              </Text>
            )}
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};
