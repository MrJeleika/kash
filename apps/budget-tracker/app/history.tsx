import { Header } from '@/components/common/header';
import { DayGroup } from '@/components/common/transactions/day-group';
import { useCategoriesStore } from '@/store/categories';
import { useTransactionsStore } from '@/store/transactions';
import {
  groupTransactionsByDate,
  searchTransactions,
} from '@/utils/transactions';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Search } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { C, FONTS } from '@/utils/theme';

const ALL_FILTER = 'ALL';

const dayExpenseTotal = (transactions: { type: string; amountInBaseCurrency: number }[]) =>
  transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amountInBaseCurrency), 0);

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
    <View className="flex-1" style={{ backgroundColor: C.paper }}>
      <Header backButton title="LEDGER" />

      <View className="px-6 pt-4 pb-2">
        <View
          className="flex-row items-center gap-2.5 px-3.5 py-2.5"
          style={{
            backgroundColor: C.paperHi,
            borderWidth: 1,
            borderColor: C.rule,
          }}
        >
          <Icon icon={Search} size={14} color={C.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search merchants, categories, notes…"
            placeholderTextColor={C.textMuted}
            style={{
              flex: 1,
              fontFamily: FONTS.sans,
              fontSize: 13,
              lineHeight: 18,
              color: C.text,
              padding: 0,
            }}
          />
        </View>
      </View>

      <View style={{ borderBottomWidth: 1, borderBottomColor: C.rule }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 4 }}
        >
          {filterPills.map((f) => {
            const active = f === ALL_FILTER ? filter === null : filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f === ALL_FILTER ? null : f)}
                className="px-3.5 py-2"
                style={{
                  borderBottomWidth: 2,
                  borderBottomColor: active ? C.red : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.monoSemi,
                    fontSize: 10,
                    lineHeight: 16,
                    letterSpacing: 1.4,
                    color: active ? C.ink : C.textMuted,
                    textTransform: 'uppercase',
                  }}
                >
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {grouped.length === 0 ? (
          <View className="items-center py-20">
            <Text style={{ color: C.textMuted, fontSize: 13, lineHeight: 18 }}>
              No transactions match.
            </Text>
          </View>
        ) : (
          grouped.map((g) => (
            <DayGroup
              key={g.date}
              date={g.date}
              total={dayExpenseTotal(g.transactions)}
              transactions={g.transactions}
              decimals={2}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
