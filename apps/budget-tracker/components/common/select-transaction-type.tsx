import { useEffect } from 'react';
import { cn } from '@/utils/shared';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Icon } from '../ui/icon';
import { reduceColorSaturation } from '@/utils/colors';

interface SelectTransactionTypeProps {
  type: 'income' | 'expense';
  setType: (type: 'income' | 'expense') => void;
}

export const SelectTransactionType = ({
  type,
  setType,
}: SelectTransactionTypeProps) => {
  const incomeButtonTranslateX = useSharedValue(0);
  const expenseButtonTranslateX = useSharedValue(0);
  const incomeButtonWidth = useSharedValue(type === 'income' ? 2 : 1);
  const expenseButtonWidth = useSharedValue(type === 'expense' ? 2 : 1);
  const incomeButtonOpacity = useSharedValue(type === 'income' ? 1 : 0.7);
  const expenseButtonOpacity = useSharedValue(type === 'expense' ? 1 : 0.7);

  useEffect(() => {
    if (type === 'income') {
      // Income button expands from left edge
      incomeButtonTranslateX.value = -25;
      incomeButtonTranslateX.value = withTiming(0, { duration: 300 });
      incomeButtonWidth.value = 1;
      incomeButtonWidth.value = withTiming(2, { duration: 300 });
      incomeButtonOpacity.value = withTiming(1, { duration: 300 });
      // Expense button shrinks and fades
      expenseButtonTranslateX.value = withTiming(0, { duration: 300 });
      expenseButtonWidth.value = withTiming(1, { duration: 300 });
      expenseButtonOpacity.value = withTiming(0.7, { duration: 300 });
    } else {
      // Expense button expands from right edge
      expenseButtonTranslateX.value = 25;
      expenseButtonTranslateX.value = withTiming(0, { duration: 300 });
      expenseButtonWidth.value = 1;
      expenseButtonWidth.value = withTiming(2, { duration: 300 });
      expenseButtonOpacity.value = withTiming(1, { duration: 300 });
      // Income button shrinks and fades
      incomeButtonTranslateX.value = withTiming(0, { duration: 300 });
      incomeButtonWidth.value = withTiming(1, { duration: 300 });
      incomeButtonOpacity.value = withTiming(0.7, { duration: 300 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const incomeButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: incomeButtonTranslateX.value }],
      flexGrow: incomeButtonWidth.value,
      opacity: incomeButtonOpacity.value,
    };
  });

  const expenseButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: expenseButtonTranslateX.value }],
      flexGrow: expenseButtonWidth.value,
      opacity: expenseButtonOpacity.value,
    };
  });

  return (
    <View className="flex flex-row p-1 bg-surface rounded-full overflow-hidden w-[150px]">
      <Animated.View style={incomeButtonStyle}>
        <Pressable
          style={{
            backgroundColor:
              type === 'income' ? reduceColorSaturation('#3A7D44') : undefined,
          }}
          className={cn(
            'p-2 rounded-full flex flex-row items-center gap-1 overflow-hidden'
          )}
          onPress={() => setType('income')}
        >
          <Icon icon={ArrowDownLeft} className="text-[#3A7D44] size-[18px]" />
          {type === 'income' && (
            <Animated.Text className="text-[#3A7D44]" numberOfLines={1}>
              Income
            </Animated.Text>
          )}
        </Pressable>
      </Animated.View>
      <Animated.View style={expenseButtonStyle}>
        <Pressable
          style={{
            backgroundColor:
              type === 'expense' ? reduceColorSaturation('#E07820') : undefined,
          }}
          className={cn(
            'p-2 rounded-full flex flex-row items-center gap-1 overflow-hidden'
          )}
          onPress={() => setType('expense')}
        >
          <Icon icon={ArrowUpRight} className="text-[#E07820] size-[18px]" />
          {type === 'expense' && (
            <Animated.Text className="text-[#E07820]" numberOfLines={1}>
              Expense
            </Animated.Text>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
};
