import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  View,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { CategoryIcon } from '@/components/common/category-icon';
import { useCategoriesStore } from '@/store/categories';
import { Category } from '@/types/categories';
import { TransactionType } from '@/types/transactions';

interface SelectCategoryProps {
  type: TransactionType;
  selectedCategory?: string;
  onSelectCategory: (categoryName: string) => void;
  onAddCategory?: () => void;
}

const ITEM_SIZE = 40;
const GAP = 5;
const STEP = ITEM_SIZE + GAP;
const SELECTED_SCALE = 1.3;
const BETWEEN_SCALE = 1.1;
const NORMAL_SCALE = 1;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Center the item: left edge should be at screen center minus half item width
const SIDE_PADDING = SCREEN_WIDTH / 2 - ITEM_SIZE / 2;

type CategoryBubbleProps = {
  category: Category;
  index: number;
  scrollX: SharedValue<number>;
};

const CategoryBubble = React.memo(
  ({ category, index, scrollX }: CategoryBubbleProps) => {
    const animatedStyle = useAnimatedStyle(() => {
      'worklet';
      const progress = scrollX.value / STEP;
      const distance = Math.abs(progress - index);

      const scale = interpolate(
        distance,
        [0, 0.5, 1],
        [SELECTED_SCALE, BETWEEN_SCALE, NORMAL_SCALE],
        Extrapolation.CLAMP
      );

      const opacity = interpolate(
        distance,
        [0, 1],
        [1, 0.6],
        Extrapolation.CLAMP
      );

      return {
        transform: [{ scale }],
        opacity,
      };
    }, [scrollX, index]);

    return (
      <View
        style={{
          width: ITEM_SIZE,
          height: ITEM_SIZE * SELECTED_SCALE,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: GAP,
        }}
      >
        <Animated.View
          style={[
            {
              width: ITEM_SIZE,
              height: ITEM_SIZE,
              alignItems: 'center',
              justifyContent: 'center',
            },
            animatedStyle,
          ]}
        >
          <CategoryIcon
            category={category}
            style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
          />
        </Animated.View>
      </View>
    );
  }
);

CategoryBubble.displayName = 'CategoryBubble';

type CategoryLabelItemProps = {
  category: Category;
  index: number;
  scrollX: SharedValue<number>;
};

const CategoryLabelItem = React.memo(
  ({ category, index, scrollX }: CategoryLabelItemProps) => {
    const animatedStyle = useAnimatedStyle(() => {
      'worklet';
      const progress = scrollX.value / STEP;
      const distance = Math.abs(progress - index);

      const opacity = interpolate(
        distance,
        [0, 0.35, 0.5],
        [1, 0.2, 0],
        Extrapolation.CLAMP
      );

      return {
        opacity,
        position: 'absolute',
      };
    }, [scrollX, index]);

    return (
      <Animated.Text
        style={[
          {
            fontSize: 15,
            fontWeight: '600',
            textAlign: 'center',
            color: category.color,
          },
          animatedStyle,
        ]}
      >
        {category.name}
      </Animated.Text>
    );
  }
);

CategoryLabelItem.displayName = 'CategoryLabelItem';

type CategoryLabelProps = {
  categories: Category[];
  scrollX: SharedValue<number>;
};

const CategoryLabel = React.memo(
  ({ categories, scrollX }: CategoryLabelProps) => (
    <View
      style={{
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
      }}
    >
      {categories.map((category, index) => (
        <CategoryLabelItem
          key={category.name}
          category={category}
          index={index}
          scrollX={scrollX}
        />
      ))}
    </View>
  )
);

CategoryLabel.displayName = 'CategoryLabel';

const SelectCategory = ({
  type,
  selectedCategory,
  onSelectCategory,
}: SelectCategoryProps) => {
  const { getCategoriesByType } = useCategoriesStore();
  const categories = useMemo(
    () => getCategoriesByType(type),
    [getCategoriesByType, type]
  );

  const [isScrollViewReady, setIsScrollViewReady] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useSharedValue(0);

  const lastSelectedIndex = useRef(-1);

  // Initialize scroll position and selection
  useEffect(() => {
    if (!categories.length) return;

    const initialIndex =
      selectedCategory !== undefined
        ? categories.findIndex((cat) => cat.name === selectedCategory)
        : 0;

    const resolvedIndex = initialIndex >= 0 ? initialIndex : 0;
    lastSelectedIndex.current = resolvedIndex;
    const targetOffset = resolvedIndex * STEP;

    if (selectedCategory === undefined || initialIndex === -1) {
      onSelectCategory(categories[resolvedIndex]!.name);
    }

    const timer = setTimeout(() => {
      if (!isScrollViewReady) {
        scrollViewRef.current?.scrollTo({ x: targetOffset, animated: false });
      }
      setIsScrollViewReady(true);

      scrollX.value = targetOffset;
    }, 50);

    return () => clearTimeout(timer);
  }, [
    categories,
    selectedCategory,
    onSelectCategory,
    scrollX,
    isScrollViewReady,
  ]);

  // Handle scroll events - update scrollX for animations
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      scrollX.value = withTiming(offsetX, { duration: 0 });
    },
    [scrollX]
  );

  // Handle scroll end - update selection
  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / STEP);
      const clampedIndex = Math.min(Math.max(index, 0), categories.length - 1);

      if (lastSelectedIndex.current !== clampedIndex) {
        lastSelectedIndex.current = clampedIndex;
        const category = categories[clampedIndex];
        if (category) {
          onSelectCategory(category.name);
        }
      }
    },
    [categories, onSelectCategory]
  );

  return (
    <View
      className="rounded-xl pt-3 bg-dark-gray pb-3"
      style={{ overflow: 'hidden' }}
    >
      <View style={{ height: ITEM_SIZE * SELECTED_SCALE }}>
        <ScrollView
          className="-translate-x-4"
          scrollViewRef={scrollViewRef}
          horizontal
          snapToInterval={STEP}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: SIDE_PADDING,
            alignItems: 'center',
          }}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollEndDrag={handleScrollEnd}
          scrollEventThrottle={16}
        >
          {categories.map((category, index) => (
            <CategoryBubble
              key={category.name}
              category={category}
              index={index}
              scrollX={scrollX}
            />
          ))}
        </ScrollView>
      </View>

      <CategoryLabel categories={categories} scrollX={scrollX} />
    </View>
  );
};

export default SelectCategory;
