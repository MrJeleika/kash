import { View, Text } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import type { CategoryBreakdown } from '@/hooks/insights/useInsights';
import { formatNumberWithSpaces } from '@/utils/shared';
import { C, FONTS } from '@/utils/theme';

interface Props {
  data: CategoryBreakdown[];
  size?: number;
  strokeWidth?: number;
  baseCurrency: string;
}

const TOP = 5;

export const CategoryDonut = ({
  data,
  size = 220,
  strokeWidth = 24,
  baseCurrency,
}: Props) => {
  const top = data.slice(0, TOP);
  const otherTotal = data.slice(TOP).reduce((s, d) => s + d.total, 0);
  const slices = otherTotal
    ? [
        ...top,
        { name: 'Other', color: C.textMute, total: otherTotal, share: 0 },
      ]
    : top;
  const total = slices.reduce((s, d) => s + d.total, 0);

  if (!total) {
    return (
      <View className="items-center py-8">
        <Text className="text-text-muted">No expenses to chart.</Text>
      </View>
    );
  }

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = slices.map((s) => {
    const portion = s.total / total;
    const length = portion * circumference;
    const seg = {
      ...s,
      length,
      offset,
    };
    offset += length;
    return seg;
  });

  return (
    <View className="items-center">
      <Svg width={size} height={size}>
        <G rotation={-90} originX={size / 2} originY={size / 2}>
          {segments.map((s, i) => (
            <Circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={s.color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${s.length} ${circumference}`}
              strokeDashoffset={-s.offset}
            />
          ))}
        </G>
      </Svg>
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontFamily: FONTS.monoSemi,
            fontSize: 9,
            letterSpacing: 1.4,
            color: C.textMuted,
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >
          Total
        </Text>
        <Text
          style={{
            fontFamily: FONTS.monoBold,
            fontSize: 22,
            color: C.ink,
            textAlign: 'center',
            marginTop: 2,
          }}
        >
          {formatNumberWithSpaces(total.toFixed(0))}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.mono,
            fontSize: 9,
            letterSpacing: 1.2,
            color: C.textMuted,
            textAlign: 'center',
          }}
        >
          {baseCurrency?.toUpperCase()}
        </Text>
      </View>

      {/* Legend */}
      <View
        className="w-full mt-5"
        style={{ borderTopWidth: 1, borderTopColor: C.rule }}
      >
        {segments.map((s, i) => (
          <View
            key={i}
            className="flex-row items-center justify-between py-2.5"
            style={{ borderBottomWidth: 1, borderBottomColor: C.rule }}
          >
            <View className="flex-row items-center gap-2 flex-1">
              <View className="h-3 w-3" style={{ backgroundColor: s.color }} />
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: FONTS.sansMedium,
                  fontSize: 13,
                  color: C.text,
                }}
              >
                {s.name}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: FONTS.monoSemi,
                fontSize: 12,
                color: C.textMuted,
              }}
            >
              {formatNumberWithSpaces(s.total.toFixed(0))} ·{' '}
              {((s.total / total) * 100).toFixed(0)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
