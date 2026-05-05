import { useCategoriesStore } from '@/store/categories';
import { useModalsStore } from '@/store/modals';
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
  const subtitle = `${transaction.categoryName} · ${formatTime(transaction.date)}`;
  const badgeLabel = transaction.categoryName.slice(0, 4).toUpperCase();

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
          style={[
            animatedStyle,
            {
              borderBottomWidth: 1,
              borderBottomColor: C.rule,
            },
          ]}
          className="flex-row items-center gap-3 px-6 py-3"
        >
          <View
            className="h-8 w-8 items-center justify-center"
            style={{
              backgroundColor: isExpense ? C.paperHi : C.greenDim,
              borderWidth: 1,
              borderColor: C.rule,
            }}
          >
            {isExpense ? (
              <Text
                style={{
                  fontFamily: FONTS.monoBold,
                  fontSize: 9,
                  color: C.text,
                  letterSpacing: 0.4,
                }}
              >
                {badgeLabel}
              </Text>
            ) : (
              <Text
                style={{
                  color: C.green,
                  fontWeight: '700',
                  fontSize: 14,
                  lineHeight: 16,
                }}
              >
                ↘
              </Text>
            )}
          </View>

          <View className="flex-1">
            <Text
              numberOfLines={1}
              style={{
                fontFamily: FONTS.sansMedium,
                fontSize: 14,
                color: C.text,
              }}
            >
              {title}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 11,
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
                color: isExpense ? C.text : C.green,
              }}
            >
              {sign}
              {amountStr}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.mono,
                fontSize: 9,
                color: C.textMute,
                letterSpacing: 1,
                marginTop: 2,
              }}
            >
              {(isDifferentCurrency
                ? `${sign}${formatNumberWithSpaces(
                    Math.abs(transaction.amount).toFixed(2)
                  )} ${transaction.currency?.toUpperCase()}`
                : transaction.baseCurrency?.toUpperCase()) ?? ''}
            </Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};
