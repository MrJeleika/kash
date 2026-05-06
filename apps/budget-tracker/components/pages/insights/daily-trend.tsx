import { View, Text } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
import type { DailyBucket } from '@/hooks/insights/useInsights';
import { C, FONTS } from '@/utils/theme';

interface Props {
  data: DailyBucket[];
  width?: number;
  height?: number;
  /** Highlights the bar for this YYYY-MM-DD in red. */
  highlightDate?: string;
  /** When provided, draws a dashed avg reference line at this value. */
  avg?: number;
}

export const DailyTrend = ({
  data,
  width = 320,
  height = 130,
  highlightDate,
  avg,
}: Props) => {
  if (data.length === 0) {
    return (
      <View className="py-8 items-center">
        <Text style={{ color: C.textMuted, fontSize: 13, lineHeight: 18 }}>
          No daily activity yet.
        </Text>
      </View>
    );
  }

  const max = Math.max(...data.map((d) => d.total), avg ?? 0, 1);
  const gap = 2;
  const barWidth = Math.max(2, (width - gap * (data.length - 1)) / data.length);
  const avgY = avg !== undefined ? height - (avg / max) * (height - 12) : null;

  const labelDates = [
    data[0]?.date,
    data[Math.floor(data.length * 0.25)]?.date,
    data[Math.floor(data.length * 0.5)]?.date,
    data[Math.floor(data.length * 0.75)]?.date,
    data[data.length - 1]?.date,
  ].filter(Boolean);

  return (
    <View>
      <View style={{ position: 'relative', height }}>
        <Svg width={width} height={height}>
          {data.map((d, i) => {
            const h = d.total === 0 ? 0 : Math.max(2, (d.total / max) * (height - 12));
            const x = i * (barWidth + gap);
            const y = height - h;
            const isHighlight = highlightDate && d.date === highlightDate;
            return (
              <Rect
                key={d.date + i}
                x={x}
                y={y}
                width={barWidth}
                height={h}
                fill={isHighlight ? C.red : C.ink}
              />
            );
          })}
          {avgY !== null && (
            <Line
              x1={0}
              y1={avgY}
              x2={width}
              y2={avgY}
              stroke={C.textMute}
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={0.7}
            />
          )}
        </Svg>
        {avg !== undefined && avgY !== null && (
          <Text
            style={{
              position: 'absolute',
              right: 0,
              top: Math.max(0, avgY - 16),
              fontFamily: FONTS.monoSemi,
              fontSize: 9,
              lineHeight: 15,
              letterSpacing: 1,
              color: C.textMute,
              backgroundColor: C.paper,
              paddingHorizontal: 4,
            }}
          >
            AVG {Math.round(avg)}
          </Text>
        )}
      </View>
      <View
        className="flex-row justify-between mt-2"
        style={{ paddingHorizontal: 0 }}
      >
        {labelDates.map((d, i) => (
          <Text
            key={d! + i}
            style={{
              fontFamily: FONTS.monoSemi,
              fontSize: 9,
              lineHeight: 15,
              letterSpacing: 1,
              color: C.textMute,
            }}
          >
            {d!.slice(8)}
          </Text>
        ))}
      </View>
    </View>
  );
};
