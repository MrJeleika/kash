import { Header } from '@/components/common/header';
import { SelectTransactionType } from '@/components/common/select-transaction-type';
import { CategoryBars } from '@/components/pages/insights/category-bars';
import { DailyTrend } from '@/components/pages/insights/daily-trend';
import { MonthStepper } from '@/components/pages/insights/month-stepper';
import { PresetChips, type Preset } from '@/components/pages/insights/preset-chips';
import { Eyebrow } from '@/components/ui/typography';
import { useCurrencyStore } from '@/store/currency';
import { useCategoriesStore } from '@/store/categories';
import { useTransactionsStore } from '@/store/transactions';
import { computeInsights } from '@/utils/insights';
import { splitAmount } from '@/utils/format';
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from '@/utils/format/dates';
import { formatNumberWithSpaces } from '@/utils/shared';
import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { C, FONTS } from '@/utils/theme';
import type { PeriodConfig } from '@/types/periods';

type PresetKey =
  | 'month'
  | 'week'
  | 'year'
  | 'ytd'
  | 'last30'
  | 'last90'
  | 'all';

const PRESETS: (Preset & { key: PresetKey | 'custom' })[] = [
  { key: 'month', label: 'Month' },
  { key: 'week', label: 'Week' },
  { key: 'year', label: 'Year' },
  { key: 'ytd', label: 'YTD' },
  { key: 'last30', label: 'Last 30D' },
  { key: 'last90', label: 'Last 90D' },
  { key: 'all', label: 'All Time' },
];

const MONTH_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const iso = (d: Date) => d.toISOString();
const EPOCH = new Date(1970, 0, 1);

const buildPeriod = (key: PresetKey, monthAnchor: Date): PeriodConfig => {
  const today = startOfDay(new Date());
  switch (key) {
    case 'month':
      return {
        label: `${MONTH_LONG[monthAnchor.getMonth()]} ${monthAnchor.getFullYear()}`,
        from: iso(startOfMonth(monthAnchor)),
        to: iso(endOfMonth(monthAnchor)),
      };
    case 'week':
      return {
        label: 'This Week',
        from: iso(startOfWeek(today)),
        to: iso(endOfWeek(today)),
      };
    case 'year':
      return {
        label: `${today.getFullYear()}`,
        from: iso(startOfYear(today)),
        to: iso(endOfYear(today)),
      };
    case 'ytd':
      return {
        label: 'YTD',
        from: iso(startOfYear(today)),
        to: iso(endOfDay(today)),
      };
    case 'last30': {
      const start = new Date(today);
      start.setDate(start.getDate() - 29);
      return { label: 'Last 30 Days', from: iso(start), to: iso(endOfDay(today)) };
    }
    case 'last90': {
      const start = new Date(today);
      start.setDate(start.getDate() - 89);
      return { label: 'Last 90 Days', from: iso(start), to: iso(endOfDay(today)) };
    }
    case 'all':
      return {
        label: 'All Time',
        from: iso(startOfDay(EPOCH)),
        to: iso(endOfDay(today)),
      };
  }
};

const fillDailyBuckets = (period: PeriodConfig, byDay: { date: string; total: number }[]) => {
  const map = new Map(byDay.map((d) => [d.date, d.total]));
  const start = startOfDay(new Date(period.from));
  const end = startOfDay(new Date(period.to));
  const diffDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  // Cap at 92 days to avoid pathological "All Time" rendering
  if (diffDays > 92) {
    return byDay;
  }
  const out: { date: string; total: number }[] = [];
  for (let i = 0; i < diffDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    out.push({ date: key, total: map.get(key) ?? 0 });
  }
  return out;
};

export default function InsightsScreen() {
  const transactions = useTransactionsStore((s) => s.transactions);
  const { getCategoryByName } = useCategoriesStore();
  const { currency } = useCurrencyStore();
  const baseCurrency = (currency || 'usd').toUpperCase();

  const [activeKey, setActiveKey] = useState<PresetKey>('month');
  const [monthAnchor, setMonthAnchor] = useState(() => startOfMonth(new Date()));
  const [view, setView] = useState<'expense' | 'income'>('expense');

  const period = useMemo(
    () => buildPeriod(activeKey, monthAnchor),
    [activeKey, monthAnchor]
  );

  const insights = useMemo(
    () =>
      computeInsights(
        transactions,
        period,
        (name) => getCategoryByName(name)?.color,
        view
      ),
    [transactions, period, getCategoryByName, view]
  );

  // Previous-period comparison (same length, immediately preceding).
  const prevTotal = useMemo(() => {
    const fromMs = new Date(period.from).getTime();
    const toMs = new Date(period.to).getTime();
    const span = toMs - fromMs;
    const prevPeriod: PeriodConfig = {
      label: 'prev',
      from: new Date(fromMs - span - 1).toISOString(),
      to: new Date(fromMs - 1).toISOString(),
    };
    return computeInsights(
      transactions,
      prevPeriod,
      (name) => getCategoryByName(name)?.color,
      view
    ).total;
  }, [transactions, period, getCategoryByName, view]);

  const exp = splitAmount(insights.total);
  const filledByDay = useMemo(
    () => fillDailyBuckets(period, insights.byDay),
    [period, insights.byDay]
  );

  const dayCount = Math.max(filledByDay.length, 1);
  const avgPerDay = insights.total / dayCount;
  const biggest = insights.byDay.reduce((m, d) => Math.max(m, d.total), 0);

  const todayKey = new Date().toISOString().slice(0, 10);

  const moMDelta = prevTotal === 0 ? null : (insights.total - prevTotal) / prevTotal;
  const moMUp = moMDelta !== null && moMDelta >= 0;
  const moMBad = view === 'expense' ? moMUp : !moMUp;
  const isExpense = view === 'expense';
  const heroLabel = isExpense ? 'Total Spending' : 'Total Income';
  const dailyLabel = isExpense ? 'Daily Spending' : 'Daily Income';

  const isAtCurrentMonth =
    monthAnchor.getFullYear() === new Date().getFullYear() &&
    monthAnchor.getMonth() === new Date().getMonth();

  const stepMonth = (delta: number) => {
    const next = new Date(monthAnchor);
    next.setMonth(next.getMonth() + delta);
    setMonthAnchor(startOfMonth(next));
    setActiveKey('month');
  };

  const periodLabel =
    activeKey === 'month'
      ? `${MONTH_LONG[monthAnchor.getMonth()].toUpperCase()} ${monthAnchor.getFullYear()}`
      : period.label.toUpperCase();

  return (
    <View className="flex-1" style={{ backgroundColor: C.paper }}>
      <Header backButton title="STATISTICS" />

      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <MonthStepper
          monthDate={monthAnchor}
          onPrev={() => stepMonth(-1)}
          onNext={() => stepMonth(1)}
          isAtCurrentMonth={isAtCurrentMonth && activeKey === 'month'}
        />

        <View className="px-6 pt-2 pb-1 items-center">
          <SelectTransactionType type={view} setType={setView} />
        </View>

        <PresetChips
          presets={PRESETS}
          active={activeKey}
          onSelect={(k) => setActiveKey(k as PresetKey)}
        />

        {/* Hero spend */}
        <View className="px-6 pt-1 pb-5">
          <Eyebrow style={{ marginBottom: 8 }}>
            {heroLabel} · {periodLabel}
          </Eyebrow>
          <View className="flex-row items-baseline">
            <Text
              style={{
                fontFamily: FONTS.serif,
                fontSize: 64,
                lineHeight: 70,
                color: C.ink,
                letterSpacing: -2,
              }}
            >
              {exp.whole}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.monoSemi,
                fontSize: 14,
                lineHeight: 20,
                color: C.textMuted,
                marginLeft: 6,
              }}
            >
              .{exp.cents} {baseCurrency}
            </Text>
          </View>

          {moMDelta !== null && (
            <View className="flex-row items-center gap-2 mt-2.5">
              <View
                className="px-2 py-0.5"
                style={{ backgroundColor: moMBad ? C.redDim : C.greenDim }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.monoBold,
                    fontSize: 10,
                    lineHeight: 16,
                    letterSpacing: 1,
                    color: moMBad ? C.redDeep : C.green,
                  }}
                >
                  {moMUp ? '↑' : '↓'} {Math.abs(moMDelta * 100).toFixed(1)}%
                </Text>
              </View>
              <Text style={{ fontSize: 12, lineHeight: 18, color: C.textMuted }}>
                vs. previous · {formatNumberWithSpaces(prevTotal.toFixed(0))}{' '}
                {baseCurrency}
              </Text>
            </View>
          )}

          {/* Mini stats */}
          <View
            className="flex-row mt-4"
            style={{
              borderWidth: 1,
              borderColor: C.rule,
              backgroundColor: C.paperHi,
            }}
          >
            <MiniStat
              label="Avg/Day"
              value={`${formatNumberWithSpaces(avgPerDay.toFixed(0))}`}
            />
            <MiniStat
              label="Entries"
              value={`${insights.txCount}`}
              divider
            />
            <MiniStat
              label="Biggest"
              value={`${formatNumberWithSpaces(biggest.toFixed(0))}`}
              divider
              isLast
            />
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: C.rule }} />

        {/* Daily bar chart */}
        <View className="px-6 pt-5 pb-5">
          <View className="flex-row items-baseline justify-between mb-3.5">
            <Eyebrow>{dailyLabel}</Eyebrow>
            <Text
              style={{
                fontFamily: FONTS.monoSemi,
                fontSize: 10,
                lineHeight: 16,
                letterSpacing: 1.2,
                color: C.textMuted,
              }}
            >
              BAR · DAY
            </Text>
          </View>
          <DailyTrend
            data={filledByDay}
            avg={avgPerDay > 0 ? avgPerDay : undefined}
            highlightDate={todayKey}
          />
        </View>

        <View style={{ height: 1, backgroundColor: C.rule }} />

        {/* Category breakdown */}
        <View className="px-6 pt-5 pb-2">
          <View className="flex-row items-baseline justify-between mb-3.5">
            <Eyebrow>By Category · {insights.byCategory.length}</Eyebrow>
          </View>
          <CategoryBars
            data={insights.byCategory}
            baseCurrency={baseCurrency}
          />
        </View>

        <View style={{ height: 1, backgroundColor: C.rule, marginTop: 4 }} />

        {/* Top merchants with rank */}
        <View className="px-6 pt-5">
          <Eyebrow>Top Merchants</Eyebrow>
          {insights.topMerchants.length === 0 ? (
            <Text style={{ color: C.textMuted, fontSize: 13, lineHeight: 18, marginTop: 12 }}>
              Add merchant names to see this breakdown.
            </Text>
          ) : (
            <View
              className="mt-3"
              style={{ borderTopWidth: 1, borderTopColor: C.rule }}
            >
              {insights.topMerchants.map((m, i) => (
                <View
                  key={m.name}
                  className="flex-row items-center py-3 gap-3"
                  style={{ borderBottomWidth: 1, borderBottomColor: C.rule }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.monoBold,
                      fontSize: 11,
                      lineHeight: 17,
                      letterSpacing: 0.5,
                      color: C.textMute,
                      width: 22,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </Text>
                  <View className="flex-1 mr-2">
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: FONTS.sansMedium,
                        fontSize: 14,
                        lineHeight: 20,
                        color: C.text,
                      }}
                    >
                      {m.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        lineHeight: 17,
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
                      lineHeight: 20,
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

const MiniStat = ({
  label,
  value,
  divider,
  isLast,
}: {
  label: string;
  value: string;
  divider?: boolean;
  isLast?: boolean;
}) => (
  <View
    className="flex-1 px-3 py-2.5"
    style={{
      borderLeftWidth: divider ? 1 : 0,
      borderLeftColor: C.rule,
    }}
  >
    <Eyebrow>{label}</Eyebrow>
    <Text
      style={{
        fontFamily: FONTS.monoSemi,
        fontSize: 14,
        lineHeight: 20,
        marginTop: 3,
        color: C.text,
      }}
    >
      {value}
    </Text>
  </View>
);
