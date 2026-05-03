import { ActionButtons } from '@/components/pages/home/action-buttons';
import { CategoryPills } from '@/components/pages/home/category-pills';
import { TransactionItem } from '@/components/pages/home/transactions/transaction-item';
import { VoiceInput } from '@/components/pages/voice-input/voice-input';
import { Icon } from '@/components/ui/icon';
import { useTransactions } from '@/hooks/transactions/useTransactions';
import { useCurrencyStore } from '@/store/currency';
import { filterGroupsByCategory, totalExpense } from '@/utils/transactions';
import { formatNumberWithSpaces } from '@/utils/shared';
import { router } from 'expo-router';
import { BarChart3, Settings, Bell } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { PeriodSelectorTrigger } from '@/components/pages/home/period-selector/period-selector-trigger';

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

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="absolute top-0 left-0 right-0 z-40 pt-12 pb-3 px-4 flex-row items-center justify-between bg-background">
        <Text className="text-text font-bold text-lg tracking-widest">
          ≡ KASH
        </Text>
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => router.push('/insights')}
            className="h-9 w-9 rounded-full bg-surface items-center justify-center active:opacity-70"
          >
            <Icon icon={BarChart3} className="text-text" />
          </Pressable>
          <Pressable
            onPress={() => router.push('/settings')}
            className="h-9 w-9 rounded-full bg-surface items-center justify-center active:opacity-70"
          >
            <Icon icon={Settings} className="text-text" />
          </Pressable>
          <Pressable
            onPress={() => {
              /* placeholder for notifications */
            }}
            className="h-9 w-9 rounded-full bg-surface items-center justify-center active:opacity-70"
          >
            <Icon icon={Bell} className="text-text" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingTop: 88, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-text-muted text-xs uppercase tracking-widest">
            Monthly Spending
          </Text>
          <View className="flex-row items-end gap-2 mt-1">
            <Text className="text-text text-5xl font-bold">
              {formatNumberWithSpaces(total.toFixed(0))}
            </Text>
            <Text className="text-text-muted text-base mb-2">
              {currency?.toUpperCase()}
            </Text>
          </View>
          <View className="mt-1">
            <PeriodSelectorTrigger />
          </View>
        </View>

        {/* Category quick-pills */}
        <CategoryPills selected={filterCategory} onSelect={setFilterCategory} />

        {/* Transactions */}
        <View className="px-4 mt-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-text font-semibold">Transactions</Text>
            <Pressable
              onPress={() => router.push('/history')}
              className="active:opacity-60"
            >
              <Text className="text-text-muted text-sm">History →</Text>
            </Pressable>
          </View>

          {visibleGroups.length === 0 ? (
            <View className="items-center py-16">
              <Text className="text-text-muted">
                No transactions for this period
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {visibleGroups.slice(0, RECENT_GROUPS_LIMIT).map((group) => (
                <View key={group.date} className="gap-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-text-muted text-xs uppercase tracking-wider">
                      {group.date}
                    </Text>
                    <Text className="text-text-muted text-xs">
                      {formatNumberWithSpaces(group.total.toFixed(0))}{' '}
                      {currency?.toUpperCase()}
                    </Text>
                  </View>
                  {group.transactions.map((transaction, index) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                      index={index}
                    />
                  ))}
                </View>
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
