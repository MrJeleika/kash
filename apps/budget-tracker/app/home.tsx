import { ActionButtons } from '@/components/pages/home/action-buttons';
import { CategoryPills } from '@/components/pages/home/category-pills';
import { VoiceInput } from '@/components/pages/voice-input/voice-input';
import { Icon } from '@/components/ui/icon';
import { Eyebrow, HeroAmount } from '@/components/ui/typography';
import { Header } from '@/components/common/header';
import { DayGroup } from '@/components/common/transactions/day-group';
import { PeriodSelectorTrigger } from '@/components/pages/home/period-selector/period-selector-trigger';
import { useTransactions } from '@/hooks/transactions/useTransactions';
import { useCurrencyStore } from '@/store/currency';
import { filterGroupsByCategory, totalExpense } from '@/utils/transactions';
import { splitAmount } from '@/utils/format';
import { router } from 'expo-router';
import { BarChart3, Settings } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { C, FONTS } from '@/utils/theme';

const RECENT_GROUPS_LIMIT = 3;

export default function HomeScreen() {
  const groupedTransactions = useTransactions();
  const { currency } = useCurrencyStore();
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const visibleGroups = useMemo(
    () => filterGroupsByCategory(groupedTransactions, filterCategory),
    [groupedTransactions, filterCategory]
  );
  const total = useMemo(() => totalExpense(visibleGroups), [visibleGroups]);
  const { whole, cents } = splitAmount(total);

  return (
    <View className="flex-1" style={{ backgroundColor: C.paper }}>
      <Header
        variant="wordmark"
        subtitle="DASHBOARD"
        actionButton={
          <>
            <Pressable onPress={() => router.push('/insights')} hitSlop={10}>
              <Icon icon={BarChart3} size={16} color={C.ink} />
            </Pressable>
            <Pressable onPress={() => router.push('/settings')} hitSlop={10}>
              <Icon icon={Settings} size={16} color={C.ink} />
            </Pressable>
          </>
        }
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-5 pb-3">
          <Eyebrow style={{ marginBottom: 12 }}>Monthly Spend</Eyebrow>
          <HeroAmount
            whole={whole}
            cents={cents}
            suffix={currency?.toUpperCase()}
            size={76}
          />
          <View className="mt-3 self-start">
            <PeriodSelectorTrigger />
          </View>
        </View>

        <CategoryPills selected={filterCategory} onSelect={setFilterCategory} />

        <View className="mt-6">
          <View className="flex-row items-center justify-between mb-3 px-6">
            <Eyebrow>Recent Entries</Eyebrow>
            <Pressable
              onPress={() => router.push('/history')}
              className="active:opacity-60"
            >
              <Text
                style={{
                  fontFamily: FONTS.monoSemi,
                  fontSize: 10,
                  letterSpacing: 1.2,
                  color: C.text,
                }}
              >
                VIEW ALL →
              </Text>
            </Pressable>
          </View>

          {visibleGroups.length === 0 ? (
            <View className="items-center py-20">
              <Text style={{ color: C.textMuted, fontSize: 13 }}>
                No transactions for this period
              </Text>
            </View>
          ) : (
            <View style={{ borderTopWidth: 1, borderTopColor: C.rule }}>
              {visibleGroups.slice(0, RECENT_GROUPS_LIMIT).map((group) => (
                <DayGroup
                  key={group.date}
                  date={group.date}
                  total={group.total}
                  transactions={group.transactions}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <ActionButtons />
      <VoiceInput />
    </View>
  );
}
