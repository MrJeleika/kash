import { View, Text } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import type { CategoryBreakdown } from '@/hooks/insights/useInsights';
import { formatNumberWithSpaces } from '@MrJeleika/utils';

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
        { name: 'Other', color: '#B5ADA0', total: otherTotal, share: 0 },
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
        style={{ position: 'absolute', top: 0, bottom: 0, justifyContent: 'center' }}
      >
        <Text className="text-text-muted text-xs uppercase tracking-widest text-center">
          Total
        </Text>
        <Text className="text-text text-2xl font-bold text-center">
          {formatNumberWithSpaces(total.toFixed(0))}
        </Text>
        <Text className="text-text-muted text-xs text-center">
          {baseCurrency.toUpperCase()}
        </Text>
      </View>

      {/* Legend */}
      <View className="w-full mt-4 gap-2">
        {segments.map((s, i) => (
          <View key={i} className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2 flex-1">
              <View
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: s.color }}
              />
              <Text className="text-text" numberOfLines={1}>
                {s.name}
              </Text>
            </View>
            <Text className="text-text-muted text-sm">
              {formatNumberWithSpaces(s.total.toFixed(0))} {baseCurrency.toUpperCase()}
              {' · '}
              {((s.total / total) * 100).toFixed(0)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
