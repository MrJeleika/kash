import { CATEGORY_COLORS } from '@/constants/category-colors';
import { View, ScrollView, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  color: string;
  setColor: (color: string) => void;
}

export const SelectColor = ({ color, setColor }: Props) => {
  return (
    <View className="w-full flex bg-dark-gray rounded-xl overflow-visible">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="overflow-visible p-4"
      >
        <View className="flex overflow-visible flex-row items-center gap-[2px]">
          {CATEGORY_COLORS.map((colorOption) => {
            const isSelected = color === colorOption.hex;
            return (
              <ColorOption
                key={colorOption.hex}
                colorOption={colorOption}
                isSelected={isSelected}
                onPress={() => setColor(colorOption.hex)}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

interface ColorOptionProps {
  colorOption: { hex: string; name: string };
  isSelected: boolean;
  onPress: () => void;
}

const ColorOption = ({
  colorOption,
  isSelected,
  onPress,
}: ColorOptionProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withTiming(isSelected ? 1.3 : 1, { duration: 100 }) },
      ],
      zIndex: isSelected ? 10 : 1,
    };
  });
  return (
    <Pressable onPress={onPress} className="relative">
      <Animated.View
        className={`w-10 h-10 rounded-[8px]`}
        style={[{ backgroundColor: colorOption.hex }, animatedStyle]}
      />
    </Pressable>
  );
};
