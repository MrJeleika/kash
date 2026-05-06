import { useCategoriesStore } from '@/store/categories';
import { useTransactionsStore } from '@/store/transactions';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useModalsStore } from '@/store/modals';
import { getIconByName } from '@/utils/icon-registry';
import { C, FONTS } from '@/utils/theme';

interface Props {
  selected: string | null;
  onSelect: (categoryName: string | null) => void;
}

const VISIBLE_COUNT = 6;

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
      contentContainerStyle={{ paddingHorizontal: 24, gap: 18 }}
      className="py-3"
    >
      {top.map((c) => {
        const active = selected === c.name;
        const IconComp = getIconByName(c.icon);
        return (
          <Pressable
            key={c.name}
            onPress={() => onSelect(active ? null : c.name)}
            className="items-center gap-1.5"
          >
            <View
              className="h-12 w-12 rounded-full items-center justify-center"
              style={{
                backgroundColor: active ? c.color : 'transparent',
                borderWidth: 1,
                borderColor: active ? c.color : c.color,
              }}
            >
              {active ? (
                <Icon icon={Check} size={20} color={C.textOnInk} />
              ) : (
                <Icon icon={IconComp} size={20} color={c.color} />
              )}
            </View>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: FONTS.monoSemi,
                fontSize: 9,
                lineHeight: 15,
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
      <Pressable
        onPress={() => setCategoriesModalOpen(true)}
        className="items-center gap-1.5"
      >
        <View
          className="h-12 w-12 rounded-full items-center justify-center"
          style={{
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: C.rule,
          }}
        >
          <Text style={{ color: C.ink, fontWeight: '700' }}>…</Text>
        </View>
        <Text
          style={{
            fontFamily: FONTS.monoSemi,
            fontSize: 9,
            lineHeight: 15,
            letterSpacing: 1.3,
            color: C.textMuted,
            textTransform: 'uppercase',
          }}
        >
          More
        </Text>
      </Pressable>
    </ScrollView>
  );
};
