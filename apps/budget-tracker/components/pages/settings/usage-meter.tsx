import { Text, View } from 'react-native';
import { Eyebrow } from '@/components/ui/typography';
import { C, FONTS } from '@/utils/theme';

interface UsageMeterProps {
  used: number;
  limit: number;
  /** Footer caption shown below the bar. */
  caption?: string;
  label?: string;
}

export function UsageMeter({
  used,
  limit,
  caption = 'Free tier · resets monthly',
  label = 'AI Usage · This month',
}: UsageMeterProps) {
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;

  return (
    <View
      className="px-6 py-4"
      style={{ borderBottomWidth: 1, borderBottomColor: C.rule }}
    >
      <View className="flex-row items-baseline justify-between mb-2">
        <Eyebrow>{label}</Eyebrow>
        <Text
          style={{
            fontFamily: FONTS.monoSemi,
            fontSize: 11,
            lineHeight: 17,
            color: C.text,
          }}
        >
          {used} / {limit} calls
        </Text>
      </View>
      <View style={{ height: 6, backgroundColor: C.paperDim }}>
        <View
          style={{ height: '100%', width: `${pct}%`, backgroundColor: C.ink }}
        />
      </View>
      <Text
        className="mt-1.5"
        style={{
          fontFamily: FONTS.mono,
          fontSize: 11,
          lineHeight: 17,
          color: C.textMuted,
        }}
      >
        {caption}
      </Text>
    </View>
  );
}
