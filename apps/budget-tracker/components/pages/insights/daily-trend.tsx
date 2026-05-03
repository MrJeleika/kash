import { View, Text } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import type { DailyBucket } from '@/hooks/insights/useInsights';

interface Props {
  data: DailyBucket[];
  width?: number;
  height?: number;
}

export const DailyTrend = ({ data, width = 320, height = 140 }: Props) => {
  if (data.length === 0) {
    return (
      <View className="py-8 items-center">
        <Text className="text-text-muted">No daily activity yet.</Text>
      </View>
    );
  }

  const max = Math.max(...data.map((d) => d.total), 1);
  const peakIndex = data.findIndex((d) => d.total === max);
  const barWidth = Math.max(2, Math.floor(width / data.length) - 2);

  return (
    <View className="bg-surface rounded-xl p-3">
      <Svg width={width} height={height}>
        {data.map((d, i) => {
          const h = (d.total / max) * (height - 16);
          const x = i * (barWidth + 2);
          const y = height - h;
          return (
            <Rect
              key={d.date}
              x={x}
              y={y}
              width={barWidth}
              height={h}
              rx={2}
              fill={i === peakIndex ? '#CC2200' : '#7A7469'}
            />
          );
        })}
      </Svg>
      {data.length > 1 && (
        <View className="flex-row justify-between mt-1">
          <Text className="text-text-muted text-xs">{data[0].date.slice(5)}</Text>
          <Text className="text-text-muted text-xs">
            {data[data.length - 1].date.slice(5)}
          </Text>
        </View>
      )}
    </View>
  );
};
