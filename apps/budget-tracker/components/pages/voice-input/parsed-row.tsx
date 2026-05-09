import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeInUp,
  FadeOutDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { CategoryIcon } from '@/components/common/category-icon';
import { SwipeToDelete } from '@/components/common/swipe-to-delete';
import { useCategoriesStore } from '@/store/categories';
import { CurrencyRates } from '@/types/currencies';
import { C, FONTS } from '@/utils/theme';
import { ParsedItem } from './state';
import { convertToBase } from './utils';

type Props = {
  item: ParsedItem;
  isFirst: boolean;
  defaultCurrency: string;
  rates: Record<string, CurrencyRates> | undefined;
  onPress: () => void;
  onDelete: () => void;
};

export const ParsedRow = ({
  item,
  isFirst,
  defaultCurrency,
  rates,
  onPress,
  onDelete,
}: Props) => {
  const { getCategoryByName } = useCategoriesStore();
  const category = getCategoryByName(item.categoryName);
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const tap = Gesture.Tap()
    .maxDuration(1000)
    .onStart(() => {
      scale.value = withTiming(0.97, { duration: 80 }, () => {
        scale.value = withTiming(1, { duration: 100 });
      });
      runOnJS(onPress)();
    });

  const baseAmount = useMemo(
    () => convertToBase(item.amount, item.currency, defaultCurrency, rates),
    [item.amount, item.currency, defaultCurrency, rates]
  );
  const isDifferentCurrency = item.currency !== defaultCurrency;
  const sign = item.type === 'expense' ? '−' : '+';

  return (
    <Animated.View
      entering={FadeInUp.duration(150)}
      exiting={FadeOutDown.duration(120)}
    >
      <SwipeToDelete onDelete={onDelete}>
        <GestureDetector gesture={tap}>
          <Animated.View
            style={[
              animatedStyle,
              {
                backgroundColor: C.inkSoft,
                borderTopWidth: isFirst ? 0 : 1,
                borderTopColor: C.inkLine,
              },
            ]}
            className="flex-row items-center gap-3 px-4 py-3"
          >
            {category ? (
              <CategoryIcon category={category} size={32} />
            ) : (
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  backgroundColor: C.inkLine,
                }}
              />
            )}
            <View className="flex-1">
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: FONTS.sansMedium,
                  fontSize: 13,
                  lineHeight: 18,
                  color: C.textOnInk,
                }}
              >
                {item.categoryName}
              </Text>
            </View>
            <View className="items-end">
              <Text
                style={{
                  fontFamily: FONTS.monoSemi,
                  fontSize: 14,
                  lineHeight: 20,
                  color: C.textOnInk,
                }}
              >
                {sign}
                {item.amount.toFixed(2)} {item.currency.toUpperCase()}
              </Text>
              {isDifferentCurrency && (
                <Text
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 9,
                    lineHeight: 15,
                    color: C.textOnInkDim,
                    letterSpacing: 1,
                    marginTop: 2,
                  }}
                >
                  {sign}
                  {baseAmount.toFixed(2)} {defaultCurrency.toUpperCase()}
                </Text>
              )}
            </View>
          </Animated.View>
        </GestureDetector>
      </SwipeToDelete>
    </Animated.View>
  );
};
