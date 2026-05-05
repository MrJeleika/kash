import { Header } from '@/components/common/header';
import { CategoryDonut } from '@/components/pages/insights/category-donut';
import { DailyTrend } from '@/components/pages/insights/daily-trend';
import { PeriodSelectorTrigger } from '@/components/pages/home/period-selector/period-selector-trigger';
import { Eyebrow, HeroAmount } from '@/components/ui/typography';
import { useInsights } from '@/hooks/insights/useInsights';
import { useCurrencyStore } from '@/store/currency';
import { splitAmount } from '@/utils/format';
import { formatNumberWithSpaces } from '@/utils/shared';
import { ScrollView, Text, View } from 'react-native';
import { C, FONTS } from '@/utils/theme';

interface StatCellProps {
  label: string;
  value: number;
  color: string;
  signed?: boolean;
  isLast?: boolean;
}

const StatCell = ({ label, value, color, signed, isLast }: StatCellProps) => {
  const sign = signed ? (value >= 0 ? '+' : '−') : '';
  return (
    <View
      className="flex-1 px-3 py-3"
      style={{
        borderRightWidth: isLast ? 0 : 1,
        borderRightColor: C.rule,
      }}
    >
      <Eyebrow>{label}</Eyebrow>
      <Text
        style={{
          fontFamily: FONTS.monoSemi,
          fontSize: 16,
          marginTop: 4,
          color,
        }}
      >
        {sign}
        {formatNumberWithSpaces(Math.abs(value).toFixed(0))}
      </Text>
    </View>
  );
};

export default function InsightsScreen() {
  const insights = useInsights();
  const { currency } = useCurrencyStore();
  const baseCurrency = (currency || 'usd').toUpperCase();
  const exp = splitAmount(insights.totalExpense);

  return (
    <View className="flex-1" style={{ backgroundColor: C.paper }}>
      <Header backButton title="INSIGHTS" />

      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <View
          className="px-6 pt-5 pb-4"
          style={{ borderBottomWidth: 1, borderBottomColor: C.rule }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <Eyebrow>Period · Spend</Eyebrow>
            <PeriodSelectorTrigger />
          </View>
          <HeroAmount
            whole={exp.whole}
            cents={exp.cents}
            suffix={baseCurrency}
            size={56}
            suffixSize={13}
          />
          <Text className="mt-2" style={{ fontSize: 12, color: C.textMuted }}>
            {insights.txCount} transaction{insights.txCount === 1 ? '' : 's'}
          </Text>
        </View>

        <View
          className="flex-row"
          style={{ borderBottomWidth: 1, borderBottomColor: C.rule }}
        >
          <StatCell label="Expense" value={insights.totalExpense} color={C.text} />
          <StatCell label="Income" value={insights.totalIncome} color={C.green} />
          <StatCell
            label="Net"
            value={insights.net}
            color={insights.net >= 0 ? C.green : C.red}
            signed
            isLast
          />
        </View>

        <View className="px-6 pt-5 pb-2">
          <Eyebrow>Spending by category</Eyebrow>
        </View>
        <View className="px-6 pb-5">
          <CategoryDonut data={insights.byCategory} baseCurrency={baseCurrency} />
        </View>

        <View style={{ height: 1, backgroundColor: C.rule }} />

        <View className="px-6 pt-5 pb-2">
          <Eyebrow>Daily trend</Eyebrow>
        </View>
        <View className="px-6 pb-5">
          <DailyTrend data={insights.byDay} />
        </View>

        <View style={{ height: 1, backgroundColor: C.rule }} />

        <View className="px-6 pt-5">
          <Eyebrow>Top merchants</Eyebrow>
          {insights.topMerchants.length === 0 ? (
            <Text style={{ color: C.textMuted, fontSize: 13, marginTop: 12 }}>
              Add merchant names to see this breakdown.
            </Text>
          ) : (
            <View
              className="mt-3"
              style={{ borderTopWidth: 1, borderTopColor: C.rule }}
            >
              {insights.topMerchants.map((m) => (
                <View
                  key={m.name}
                  className="flex-row items-center justify-between py-3"
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: C.rule,
                  }}
                >
                  <View className="flex-1 mr-3">
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: FONTS.sansMedium,
                        fontSize: 14,
                        color: C.text,
                      }}
                    >
                      {m.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: C.textMuted,
                        marginTop: 2,
                      }}
                    >
                      {m.count} transaction{m.count === 1 ? '' : 's'}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: FONTS.monoSemi,
                      fontSize: 14,
                      color: C.text,
                    }}
                  >
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
