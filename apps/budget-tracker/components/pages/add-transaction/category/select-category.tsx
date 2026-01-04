import { useCategoriesStore } from '@/store/categories';
import { Category } from '@/types/categories';
import { TransactionType } from '@/types/transactions';
import React, { useRef, useState, useCallback } from 'react';
import { View, FlatList, Dimensions, ViewToken } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
  SharedValue,
} from 'react-native-reanimated';
import { CategoryIcon } from '@/components/common/category-icon';

interface SelectCategoryProps {
  type: TransactionType;
  selectedCategory?: string;
  onSelectCategory: (categoryName: string) => void;
  onAddCategory?: () => void;
}

const ITEM_WIDTH = 40;
const SELECTED_SCALE = 1.5;
const ITEM_SPACING = 2;

interface CategoryItemProps {
  category: Category;
  index: number;
  scrollX: SharedValue<number>;
  itemWidth: number;
  screenWidth: number;
}

const CategoryItem = ({
  category,
  index,
  scrollX,
  itemWidth,
  screenWidth,
}: CategoryItemProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    // Position of this item's center
    const itemCenter = index * itemWidth + itemWidth / 2;

    // Current scroll position adjusted to screen center
    const scrollCenter = scrollX.value + screenWidth / 2;

    // Distance from this item to screen center
    const distance = Math.abs(scrollCenter - itemCenter);

    const scale = interpolate(
      distance,
      [0, itemWidth],
      [SELECTED_SCALE, 1],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      distance,
      [0, itemWidth, itemWidth * 2],
      [1, 0.7, 0.4],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View
      style={{
        width: itemWidth,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CategoryIcon
        category={category}
        style={[
          {
            width: ITEM_WIDTH,
            height: ITEM_WIDTH,
            justifyContent: 'center',
            alignItems: 'center',
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};

const SelectCategory = ({
  type,
  selectedCategory,
  onSelectCategory,
}: SelectCategoryProps) => {
  const { getCategoriesByType } = useCategoriesStore();
  const categories = getCategoriesByType(type);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = Dimensions.get('window');

  const ITEM_SIZE = ITEM_WIDTH + ITEM_SPACING;

  // Auto-select first category if none selected
  React.useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      onSelectCategory(categories[0]!.name);
    }
  }, [selectedCategory, categories, onSelectCategory]);

  // Sync scroll when selectedCategory changes externally
  React.useEffect(() => {
    if (selectedCategory) {
      const index = categories.findIndex(
        (item) => item?.name === selectedCategory
      );
      if (index >= 0 && index !== currentIndex) {
        setCurrentIndex(index);
        flatListRef.current?.scrollToIndex({ index, animated: true });
      }
    }
  }, [selectedCategory, categories, currentIndex]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        // Find the item closest to center
        const centerX = width / 2;
        let closestItem = viewableItems[0];
        let minDistance = Infinity;

        viewableItems.forEach((item) => {
          if (item.index !== null) {
            const itemCenter =
              item.index * ITEM_SIZE + ITEM_SIZE / 2 - scrollX.value;
            const distance = Math.abs(centerX - itemCenter);
            if (distance < minDistance) {
              minDistance = distance;
              closestItem = item;
            }
          }
        });

        if (closestItem.index !== null) {
          const index = closestItem.index;
          if (index !== currentIndex) {
            setCurrentIndex(index);
            if (categories[index]) {
              onSelectCategory(categories[index].name);
            }
          }
        }
      }
    },
    [categories, onSelectCategory, width, ITEM_SIZE, scrollX, currentIndex]
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 10,
  };

  // Text opacity animation
  const textOpacity = useAnimatedStyle(() => {
    const offset = scrollX.value / ITEM_SIZE;
    const distanceFromSnap = Math.abs(offset - Math.round(offset));
    const opacity = interpolate(
      distanceFromSnap,
      [0, 0.3],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const renderItem = ({ item, index }: { item: Category; index: number }) => (
    <CategoryItem
      category={item}
      index={index}
      scrollX={scrollX}
      itemWidth={ITEM_SIZE}
      screenWidth={width}
    />
  );

  return (
    <View
      className="rounded-xl pt-3 bg-dark-gray pb-3"
      style={{ overflow: 'hidden' }}
    >
      <View style={{ height: ITEM_WIDTH * SELECTED_SCALE + 10 }}>
        <Animated.FlatList
          ref={flatListRef}
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_SIZE}
          snapToAlignment="center"
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: width / 2 - ITEM_SIZE / 2,
          }}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(_, index) => ({
            length: ITEM_SIZE,
            offset: ITEM_SIZE * index,
            index,
          })}
        />
      </View>
      <Animated.Text
        style={[
          { color: categories[currentIndex]?.color || '#FFFFFF' },
          textOpacity,
        ]}
        className="text-center text-sm mt-1"
      >
        {categories[currentIndex]?.name}
      </Animated.Text>
    </View>
  );
};

export default SelectCategory;
