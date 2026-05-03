import { Header } from '@/components/common/header';
import { TransactionItem } from '@/components/pages/home/transactions/transaction-item';
import { Input } from '@/components/ui/input/input';
import { useCategoriesStore } from '@/store/categories';
import { useTransactionsStore } from '@/store/transactions';
import {
  groupTransactionsByDate,
  searchTransactions,
} from '@/utils/transactions';
import { cn } from '@/utils/shared';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

const ALL_FILTER = 'ALL';

export default function HistoryScreen() {
  const transactions = useTransactionsStore((s) => s.transactions);
  const { getCategoriesByType } = useCategoriesStore();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string | null>(null);

  const filterPills = useMemo(
    () => [ALL_FILTER, ...getCategoriesByType('expense').map((c) => c.name)],
    [getCategoriesByType]
  );

  const grouped = useMemo(
    () =>
      groupTransactionsByDate(
        searchTransactions(transactions, { query, category: filter })
      ),
    [transactions, query, filter]
  );

  return (
    <View className="flex-1 bg-background">
      <Header
        backButton
        centerElement={
          <Text className="text-text font-semibold text-lg">History</Text>
        }
      />

      <ScrollView
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 48 }}
        className="px-4"
      >
        <Input
          value={query}
          onChangeText={setQuery}
          placeholder="Search transactions…"
          className="bg-surface border border-border rounded-xl px-4 py-3 text-text"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 16 }}
        >
          {filterPills.map((f) => {
            const active = f === ALL_FILTER ? filter === null : filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f === ALL_FILTER ? null : f)}
                className={cn(
                  'px-4 py-2 rounded-full border',
                  active
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                )}
              >
                <Text
                  className={cn(
                    'text-xs uppercase tracking-wider font-semibold',
                    active ? 'text-background' : 'text-text-muted'
                  )}
                >
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {grouped.length === 0 ? (
          <View className="items-center py-16">
            <Text className="text-text-muted">No transactions match.</Text>
          </View>
        ) : (
          <View className="gap-4">
            {grouped.map((g) => (
              <View key={g.date} className="gap-1">
                <Text className="text-text-muted text-xs uppercase tracking-wider mb-1">
                  {g.date}
                </Text>
                {g.transactions.map((t, i) => (
                  <TransactionItem key={t.id} transaction={t} index={i} />
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
