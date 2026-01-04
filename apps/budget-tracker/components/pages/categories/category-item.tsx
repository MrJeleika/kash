import { CategoryIcon } from '@/components/common/category-icon';
import { useModalsStore } from '@/store/modals';
import { Category } from '@/types/categories';
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

interface Props {
  category: Category;
  index: number;
}

export const CategoryItem = ({ category, index }: Props) => {
  const { setCategoryToEdit, setAddCategoryModalOpen } = useModalsStore();

  const handlePress = () => {
    setCategoryToEdit(category);
    setAddCategoryModalOpen(true);
  };

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

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
          className="flex flex-row items-center justify-between px-3 py-2 rounded-xl bg-dark-gray"
        >
          <View className="flex flex-row items-center gap-2">
            <CategoryIcon category={category} size={36} />
            <Text className="text-white font-medium text-sm">
              {category.name}
            </Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};
