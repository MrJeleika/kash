import { CATEGORY_ICONS } from '@/constants/category-icons';
import { Icon } from '@/components/ui/icon';
import { View, ScrollView, Pressable, Text } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { LucideIcon } from 'lucide-react-native';

interface Props {
  icon: LucideIcon;
  setIcon: (icon: LucideIcon) => void;
  color?: string; // For icon color
}

export const SelectIcon = ({ icon: selectedIcon, setIcon }: Props) => {
  // Helper function to chunk icons into groups of 4
  const chunkIcons = (icons: any[], size: number) => {
    const chunks = [];
    for (let i = 0; i < icons.length; i += size) {
      chunks.push(icons.slice(i, i + size));
    }
    return chunks;
  };

  return (
    <View className="w-full flex bg-surface rounded-xl overflow-visible">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="overflow-visible p-2"
      >
        <View className="flex flex-row gap-4">
          {CATEGORY_ICONS.map((categoryGroup, categoryIndex) => {
            const iconRows = chunkIcons(categoryGroup.icons, 4);
            return (
              <View
                key={`category-${categoryIndex}`}
                className="gap-2 min-w-36"
              >
                <View className="px-2">
                  <Text className="text-text-muted font-medium text-sm text-left">
                    {categoryGroup.category}
                  </Text>
                </View>
                <View className="">
                  {iconRows.map((row, rowIndex) => (
                    <View
                      key={`row-${rowIndex}`}
                      className="flex flex-row justify-center"
                    >
                      {row.map((iconOption, iconIndex) => {
                        const isSelected = selectedIcon === iconOption.icon;
                        return (
                          <IconOption
                            key={`${iconOption.name}-${iconIndex}`}
                            iconOption={iconOption}
                            isSelected={isSelected}
                            onPress={() => setIcon(iconOption.icon)}
                          />
                        );
                      })}
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

interface IconOptionProps {
  iconOption: { icon: LucideIcon; name: string };
  isSelected: boolean;
  onPress: () => void;
}

const IconOption = ({ iconOption, isSelected, onPress }: IconOptionProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: isSelected ? '#ffffff' : 'none',
    };
  });

  return (
    <Pressable onPress={onPress} className="relative">
      <Animated.View
        className={`w-10 h-10 rounded-xl items-center justify-center 
          `}
        style={animatedStyle}
      >
        <Icon
          icon={iconOption.icon}
          size={16}
          color={isSelected ? 'black' : 'white'}
        />
      </Animated.View>
    </Pressable>
  );
};
