import { useCategoriesStore } from '@/store/categories';
import { useTransactionsStore } from '@/store/transactions';
import { cn } from '@MrJeleika/utils';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { CategoryIcon } from '@/components/common/category-icon';
import { useModalsStore } from '@/store/modals';

interface Props {
  selected: string | null;
  onSelect: (categoryName: string | null) => void;
}

const VISIBLE_COUNT = 4;

export const CategoryPills = ({ selected, onSelect }: Props) => {
  const { getAllCategories } = useCategoriesStore();
  const transactions = useTransactionsStore((s) => s.transactions);
  const setCategoriesModalOpen = useModalsStore((s) => s.setCategoriesModalOpen);

  const top = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of transactions) {
      if (t.deletedAt || t.type !== 'expense') continue;
      counts.set(t.categoryName, (counts.get(t.categoryName) ?? 0) + 1);
    }
    const cats = getAllCategories().filter((c) => c.type === 'expense');
    return cats
      .slice()
      .sort(
        (a, b) => (counts.get(b.name) ?? 0) - (counts.get(a.name) ?? 0)
      )
      .slice(0, VISIBLE_COUNT);
  }, [transactions, getAllCategories]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      className="py-2"
    >
      {top.map((c) => {
        const active = selected === c.name;
        return (
          <Pressable
            key={c.name}
            onPress={() => onSelect(active ? null : c.name)}
            className="items-center gap-1"
          >
            <View
              className={cn(
                'h-12 w-12 rounded-full items-center justify-center',
                active ? 'bg-accent' : 'bg-surface'
              )}
            >
              <CategoryIcon category={c} size={28} />
            </View>
            <Text className="text-xs uppercase tracking-wider text-text-muted">
              {c.name}
            </Text>
          </Pressable>
        );
      })}
      <Pressable
        onPress={() => setCategoriesModalOpen(true)}
        className="items-center gap-1"
      >
        <View className="h-12 w-12 rounded-full items-center justify-center bg-surface">
          <Text className="text-text font-bold">…</Text>
        </View>
        <Text className="text-xs uppercase tracking-wider text-text-muted">
          More
        </Text>
      </Pressable>
    </ScrollView>
  );
};
