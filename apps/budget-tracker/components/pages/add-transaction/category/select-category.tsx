import React, { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useCategoriesStore } from '@/store/categories';
import { TransactionType } from '@/types/transactions';
import { getIconByName } from '@/utils/icon-registry';
import { C, FONTS } from '@/utils/theme';

interface SelectCategoryProps {
  type: TransactionType;
  selectedCategory?: string;
  onSelectCategory: (categoryName: string) => void;
}

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

  useEffect(() => {
    if (!categories.length) return;
    if (
      selectedCategory === undefined ||
      !categories.find((c) => c.name === selectedCategory)
    ) {
      onSelectCategory(categories[0]!.name);
    }
  }, [categories, selectedCategory, onSelectCategory]);

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 18, paddingVertical: 8 }}
      >
        {categories.map((c) => {
          const active = c.name === selectedCategory;
          const IconComp = getIconByName(c.icon);
          return (
            <Pressable
              key={c.name}
              onPress={() => onSelectCategory(c.name)}
              className="items-center gap-1.5"
            >
              <View
                className="h-12 w-12 rounded-full items-center justify-center"
                style={{
                  backgroundColor: active ? C.red : 'transparent',
                  borderWidth: active ? 0 : 1,
                  borderColor: C.rule,
                }}
              >
                {active ? (
                  <Icon icon={Check} size={20} color={C.textOnInk} strokeWidth={2} />
                ) : (
                  <Icon icon={IconComp} size={20} color={C.ink} strokeWidth={1.6} />
                )}
              </View>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: FONTS.monoSemi,
                  fontSize: 9,
                  letterSpacing: 1.3,
                  color: active ? C.ink : C.textMuted,
                  textTransform: 'uppercase',
                }}
              >
                {c.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SelectCategory;
