import { View, Text } from 'react-native';
import type { CategoryBreakdown } from '@/hooks/insights/useInsights';
import { formatNumberWithSpaces } from '@/utils/shared';
import { C, FONTS } from '@/utils/theme';

interface Props {
  data: CategoryBreakdown[];
  baseCurrency: string;
}

export const CategoryBars = ({ data, baseCurrency }: Props) => {
  if (data.length === 0) {
    return (
      <View className="py-6 items-center">
        <Text style={{ color: C.textMuted, fontSize: 13, lineHeight: 18 }}>
          No expenses to break down.
        </Text>
      </View>
    );
  }

  return (
    <View>
      {/* Stacked bar */}
      <View
        className="flex-row overflow-hidden mb-3.5"
        style={{ height: 12 }}
      >
        {data.map((c, i) => (
          <View
            key={c.name}
            style={{
              flex: c.share,
              backgroundColor: c.color,
              borderRightWidth: i < data.length - 1 ? 1 : 0,
              borderRightColor: C.paper,
            }}
          />
        ))}
      </View>

      {/* Per-category rows */}
      <View style={{ borderTopWidth: 1, borderTopColor: C.rule }}>
        {data.map((c) => (
          <View
            key={c.name}
            className="flex-row items-center py-3 gap-3"
            style={{ borderBottomWidth: 1, borderBottomColor: C.rule }}
          >
            <View
              style={{ width: 10, height: 10, backgroundColor: c.color }}
            />
            <Text
              numberOfLines={1}
              className="flex-1"
              style={{
                fontFamily: FONTS.monoSemi,
                fontSize: 11,
                lineHeight: 17,
                letterSpacing: 1.2,
                color: C.text,
                textTransform: 'uppercase',
              }}
            >
              {c.name}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.monoSemi,
                fontSize: 12,
                lineHeight: 18,
                color: C.textMuted,
              }}
            >
              {(c.share * 100).toFixed(1)}%
            </Text>
            <Text
              style={{
                fontFamily: FONTS.monoSemi,
                fontSize: 13,
                lineHeight: 18,
                color: C.text,
                minWidth: 70,
                textAlign: 'right',
              }}
            >
              {formatNumberWithSpaces(c.total.toFixed(0))} {baseCurrency}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
