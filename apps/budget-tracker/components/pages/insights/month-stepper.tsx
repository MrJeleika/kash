import { Pressable, Text, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { C, FONTS } from '@/utils/theme';

interface Props {
  /** First day of the currently-viewed month. */
  monthDate: Date;
  onPrev: () => void;
  onNext: () => void;
  /** When true, hides the "Next" button (we don't step beyond current month). */
  isAtCurrentMonth?: boolean;
}

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const MonthStepper = ({
  monthDate,
  onPrev,
  onNext,
  isAtCurrentMonth,
}: Props) => {
  const month = MONTH_NAMES[monthDate.getMonth()];
  const year = monthDate.getFullYear();

  const StepBtn = ({
    onPress,
    children,
    disabled,
  }: {
    onPress: () => void;
    children: React.ReactNode;
    disabled?: boolean;
  }) => (
    <Pressable
      onPress={disabled ? undefined : onPress}
      hitSlop={8}
      className="items-center justify-center active:opacity-60"
      style={{
        width: 36,
        height: 36,
        borderWidth: 1,
        borderColor: C.rule,
        backgroundColor: C.paperHi,
        opacity: disabled ? 0.3 : 1,
      }}
    >
      {children}
    </Pressable>
  );

  return (
    <View
      className="flex-row items-center justify-between px-6 py-3.5"
      style={{ borderBottomWidth: 1, borderBottomColor: C.rule }}
    >
      <StepBtn onPress={onPrev}>
        <Icon icon={ChevronLeft} size={14} color={C.ink} />
      </StepBtn>

      <View className="items-center">
        <Text
          style={{
            fontFamily: FONTS.monoSemi,
            fontSize: 10,
            lineHeight: 16,
            letterSpacing: 1.8,
            color: C.textMuted,
          }}
        >
          VIEWING
        </Text>
        <View className="flex-row items-baseline mt-0.5">
          <Text
            style={{
              fontFamily: FONTS.serif,
              fontSize: 22,
              lineHeight: 29,
              color: C.ink,
              letterSpacing: -0.2,
            }}
          >
            {month}{' '}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.serifItalic,
              fontSize: 22,
              lineHeight: 29,
              color: C.ink,
              letterSpacing: -0.2,
            }}
          >
            {year}
          </Text>
        </View>
      </View>

      <StepBtn onPress={onNext} disabled={isAtCurrentMonth}>
        <Icon icon={ChevronRight} size={14} color={C.ink} />
      </StepBtn>
    </View>
  );
};
