import { Pressable, Text, View } from 'react-native';
import { C, FONTS } from '@/utils/theme';

const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const MONTH_LONG = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];

const sameDate = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

interface Props {
  /** Year and zero-based month index of the calendar to render. */
  year: number;
  monthIdx: number;
  /** Today's date — gets a hairline ring if not selected. */
  today?: Date;
  /** Single-date selection. */
  single?: Date;
  /** Range selection — start/end inclusive. */
  range?: { start: Date; end: Date | null };
  /** Tap handler — receives the tapped date. */
  onPressDay?: (date: Date) => void;
  /** When true, hides the month label. */
  hideLabel?: boolean;
}

export const MonthCalendar = ({
  year,
  monthIdx,
  today,
  single,
  range,
  onPressDay,
  hideLabel,
}: Props) => {
  const first = new Date(year, monthIdx, 1);
  const startDow = (first.getDay() + 6) % 7; // Monday-anchored
  const daysIn = new Date(year, monthIdx + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysIn; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const inRange = (d: number) => {
    if (!range || !range.end) return false;
    const t = new Date(year, monthIdx, d).getTime();
    return t > range.start.getTime() && t < range.end.getTime();
  };
  const isStart = (d: number) =>
    !!range && sameDate(new Date(year, monthIdx, d), range.start);
  const isEnd = (d: number) =>
    !!range && !!range.end && sameDate(new Date(year, monthIdx, d), range.end);
  const isSingle = (d: number) =>
    !!single && sameDate(new Date(year, monthIdx, d), single);
  const isToday = (d: number) =>
    !!today && sameDate(new Date(year, monthIdx, d), today);

  return (
    <View>
      {!hideLabel && (
        <Text
          style={{
            fontFamily: FONTS.monoSemi,
            fontSize: 10,
            lineHeight: 16,
            letterSpacing: 1.4,
            color: C.textMuted,
            paddingHorizontal: 24,
            paddingBottom: 10,
          }}
        >
          {MONTH_LONG[monthIdx]} {year}
        </Text>
      )}

      <View
        className="flex-row"
        style={{ paddingHorizontal: 16, paddingBottom: 4 }}
      >
        {DOW.map((d, i) => (
          <Text
            key={i}
            className="flex-1 text-center"
            style={{
              fontFamily: FONTS.monoSemi,
              fontSize: 9,
              lineHeight: 15,
              letterSpacing: 1.4,
              color: C.textMute,
              paddingVertical: 4,
            }}
          >
            {d}
          </Text>
        ))}
      </View>

      <View className="flex-row flex-wrap" style={{ paddingHorizontal: 16 }}>
        {cells.map((d, i) => {
          if (d === null) {
            return (
              <View
                key={i}
                style={{ width: '14.2857%', aspectRatio: 1 }}
              />
            );
          }
          const start = isStart(d);
          const end = isEnd(d);
          const mid = inRange(d);
          const sing = isSingle(d);
          const tod = isToday(d);
          const isSelectedInk = start || end || sing;
          const showRangeBg = mid || (start && range?.end) || (end && range?.end);

          return (
            <Pressable
              key={i}
              onPress={() =>
                onPressDay && onPressDay(new Date(year, monthIdx, d))
              }
              style={{
                width: '14.2857%',
                aspectRatio: 1,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {showRangeBg && (
                <View
                  style={{
                    position: 'absolute',
                    top: '15%',
                    bottom: '15%',
                    left: start ? '50%' : 0,
                    right: end ? '50%' : 0,
                    backgroundColor: C.redDim,
                  }}
                />
              )}
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isSelectedInk ? C.ink : 'transparent',
                  borderWidth: tod && !isSelectedInk ? 1 : 0,
                  borderColor: C.ink,
                }}
              >
                <Text
                  style={{
                    fontFamily:
                      isSelectedInk || tod ? FONTS.monoBold : FONTS.monoMedium,
                    fontSize: 13,
                    lineHeight: 18,
                    color: isSelectedInk ? C.textOnInk : C.text,
                  }}
                >
                  {d}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
