import { useCategoriesStore } from '@/store/categories';
import { useModalsStore } from '@/store/modals';
import { useTransactionsStore } from '@/store/transactions';
import { Transaction } from '@/types/transactions';
import { formatTime } from '@/utils/format/dates';
import { formatNumberWithSpaces } from '@/utils/shared';
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
import { CategoryIcon } from '@/components/common/category-icon';
import { SwipeToDelete } from '@/components/common/swipe-to-delete';
import { C, FONTS } from '@/utils/theme';

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
  const removeTransaction = useTransactionsStore((s) => s.removeTransaction);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const category = getCategoryByName(transaction.categoryName);
  if (!category) return null;

  const isExpense = transaction.type === 'expense';
  const isDifferentCurrency = transaction.currency !== transaction.baseCurrency;
  const sign = isExpense ? '−' : '+';
  const amountStr = formatNumberWithSpaces(
    Math.abs(transaction.amountInBaseCurrency).toFixed(2)
  );
  const title = transaction.merchant || transaction.categoryName;
  const note = transaction.note?.trim();
  const time = formatTime(transaction.updatedAt);
  const subtitle = note ? `${note} · ${time}` : time;

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
      <SwipeToDelete onDelete={() => removeTransaction(transaction.id)}>
      <GestureDetector gesture={tap}>
        <Animated.View
          style={[
            animatedStyle,
            {
              backgroundColor: C.paper,
              borderBottomWidth: 1,
              borderBottomColor: C.rule,
            },
          ]}
          className="flex-row items-center gap-3 px-6 py-3"
        >
          <CategoryIcon category={category} size={36} />

          <View className="flex-1">
            <Text
              numberOfLines={1}
              style={{
                fontFamily: FONTS.sansMedium,
                fontSize: 14,
                lineHeight: 20,
                color: C.text,
              }}
            >
              {title}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 11,
                lineHeight: 17,
                color: C.textMuted,
                marginTop: 2,
              }}
            >
              {subtitle}
            </Text>
          </View>

          <View className="items-end">
            <Text
              style={{
                fontFamily: FONTS.monoSemi,
                fontSize: 14,
                lineHeight: 20,
                color: isExpense ? C.text : C.green,
              }}
            >
              {sign}
              {amountStr}
              {transaction.baseCurrency
                ? ` ${transaction.baseCurrency.toUpperCase()}`
                : ''}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.mono,
                fontSize: 9,
                lineHeight: 15,
                color: C.textMute,
                letterSpacing: 1,
                marginTop: 2,
              }}
            >
              {isDifferentCurrency
                ? `${sign}${formatNumberWithSpaces(
                    Math.abs(transaction.amount).toFixed(2)
                  )} ${transaction.currency?.toUpperCase()}`
                : ' '}
            </Text>
          </View>
        </Animated.View>
      </GestureDetector>
      </SwipeToDelete>
    </Animated.View>
  );
};
