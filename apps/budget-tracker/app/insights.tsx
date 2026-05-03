import { Header } from '@/components/common/header';
import { CategoryDonut } from '@/components/pages/insights/category-donut';
import { DailyTrend } from '@/components/pages/insights/daily-trend';
import { PeriodSelectorTrigger } from '@/components/pages/home/period-selector/period-selector-trigger';
import { useInsights } from '@/hooks/insights/useInsights';
import { useCurrencyStore } from '@/store/currency';
import { formatNumberWithSpaces } from '@MrJeleika/utils';
import { ScrollView, Text, View } from 'react-native';

export default function InsightsScreen() {
  const insights = useInsights();
  const { currency } = useCurrencyStore();
  const baseCurrency = (currency || 'usd').toUpperCase();

  return (
    <View className="flex-1 bg-background">
      <Header
        backButton
        centerElement={
          <Text className="text-text font-semibold text-lg">Insights</Text>
        }
      />

      <ScrollView
        className="px-4"
        contentContainerStyle={{ paddingTop: 96, paddingBottom: 48, gap: 24 }}
      >
        {/* Period */}
        <View className="items-center">
          <PeriodSelectorTrigger />
        </View>

        {/* Total card */}
        <View className="bg-surface rounded-2xl p-4 gap-3">
          <Text className="text-text-muted text-xs uppercase tracking-widest">
            Period summary
          </Text>
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-text-muted text-xs">Expense</Text>
              <Text className="text-text text-2xl font-bold">
                {formatNumberWithSpaces(insights.totalExpense.toFixed(0))}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-text-muted text-xs">Income</Text>
              <Text className="text-text text-2xl font-bold">
                {formatNumberWithSpaces(insights.totalIncome.toFixed(0))}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-text-muted text-xs">Net</Text>
              <Text
                className="text-2xl font-bold"
                style={{ color: insights.net >= 0 ? '#3A7D44' : '#CC2200' }}
              >
                {insights.net >= 0 ? '+' : '-'}
                {formatNumberWithSpaces(Math.abs(insights.net).toFixed(0))}
              </Text>
            </View>
          </View>
          <Text className="text-text-muted text-xs">
            {insights.txCount} transaction{insights.txCount === 1 ? '' : 's'}
          </Text>
        </View>

        {/* Spending by category */}
        <View className="bg-surface rounded-2xl p-4">
          <Text className="text-text-muted text-xs uppercase tracking-widest mb-3">
            Spending by category
          </Text>
          <CategoryDonut
            data={insights.byCategory}
            baseCurrency={baseCurrency}
          />
        </View>

        {/* Daily trend */}
        <View>
          <Text className="text-text-muted text-xs uppercase tracking-widest mb-2 px-1">
            Daily trend
          </Text>
          <DailyTrend data={insights.byDay} />
        </View>

        {/* Top merchants */}
        <View className="bg-surface rounded-2xl p-4">
          <Text className="text-text-muted text-xs uppercase tracking-widest mb-3">
            Top merchants
          </Text>
          {insights.topMerchants.length === 0 ? (
            <Text className="text-text-muted">
              Add merchant names to see this breakdown.
            </Text>
          ) : (
            <View className="gap-2">
              {insights.topMerchants.map((m) => (
                <View
                  key={m.name}
                  className="flex-row items-center justify-between"
                >
                  <View className="flex-1">
                    <Text className="text-text" numberOfLines={1}>
                      {m.name}
                    </Text>
                    <Text className="text-text-muted text-xs">
                      {m.count} transaction{m.count === 1 ? '' : 's'}
                    </Text>
                  </View>
                  <Text className="text-text font-semibold">
                    {formatNumberWithSpaces(m.total.toFixed(0))} {baseCurrency}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
