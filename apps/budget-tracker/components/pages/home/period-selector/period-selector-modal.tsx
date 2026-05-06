import { Header } from '@/components/common/header';
import { ModalBase, ModalBaseRef } from '@/components/common/modal-base';
import { MonthCalendar } from '@/components/ui/calendar/month-calendar';
import { useModalsStore } from '@/store/modals';
import { useTransactionsStore } from '@/store/transactions';
import { getPeriodConfigs } from '@/constants/periods';
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { C, FONTS } from '@/utils/theme';
import {
  endOfDay,
  startOfDay,
  startOfMonth,
} from '@/utils/format/dates';

const MONTH_SHORT = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

const PRESET_LABELS = [
  'This Week',
  'This Month',
  'Last Month',
  'Last 30 Days',
  'Last 90 Days',
  'This Year',
  'Last Year',
  'All Time',
];

const fmtChip = (d: Date) =>
  `${MONTH_SHORT[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;

const daysBetween = (a: Date, b: Date) =>
  Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86400000) + 1;

export const PeriodSelectorModal = () => {
  const modalRef = useRef<ModalBaseRef>(null);
  const { setPeriod, period: currentPeriod } = useTransactionsStore();
  const { periodSelectorModalOpen, setPeriodSelectorModalOpen } =
    useModalsStore();

  const today = useMemo(() => startOfDay(new Date()), []);
  const [anchorMonth, setAnchorMonth] = useState(() => startOfMonth(today));
  const [activePreset, setActivePreset] = useState<string | null>(
    currentPeriod.label
  );
  const [range, setRange] = useState<{ start: Date; end: Date | null }>({
    start: new Date(currentPeriod.from),
    end: new Date(currentPeriod.to),
  });

  useEffect(() => {
    if (periodSelectorModalOpen) {
      setActivePreset(currentPeriod.label);
      setRange({
        start: new Date(currentPeriod.from),
        end: new Date(currentPeriod.to),
      });
      setAnchorMonth(startOfMonth(new Date(currentPeriod.from)));
    }
  }, [periodSelectorModalOpen, currentPeriod]);

  const handleClose = () => modalRef.current?.close();

  const stepMonth = (delta: number) => {
    const next = new Date(anchorMonth);
    next.setMonth(next.getMonth() + delta);
    setAnchorMonth(startOfMonth(next));
  };

  const handlePresetPress = useCallback(
    (label: string) => {
      const preset = getPeriodConfigs().find((p) => p.label === label);
      if (!preset) return;
      setActivePreset(label);
      setRange({ start: new Date(preset.from), end: new Date(preset.to) });
      setAnchorMonth(startOfMonth(new Date(preset.from)));
    },
    []
  );

  const handleDayPress = (date: Date) => {
    setActivePreset(null);
    setRange((cur) => {
      // Reset on either: complete range exists OR tapping before current start.
      if (cur.end || date.getTime() < cur.start.getTime()) {
        return { start: startOfDay(date), end: null };
      }
      return { start: cur.start, end: endOfDay(date) };
    });
  };

  const handleApply = () => {
    if (!range.end) return;
    const label =
      activePreset ?? `${fmtChip(range.start)} → ${fmtChip(range.end)}`;
    setPeriod({
      label,
      from: range.start.toISOString(),
      to: range.end.toISOString(),
    });
    handleClose();
  };

  const handleReset = () => {
    setRange({ start: today, end: endOfDay(today) });
    setActivePreset(null);
  };

  const nextMonth = useMemo(() => {
    const m = new Date(anchorMonth);
    m.setMonth(m.getMonth() + 1);
    return m;
  }, [anchorMonth]);

  const selectionCount = range.end
    ? daysBetween(range.start, range.end)
    : 0;

  return (
    <ModalBase
      ref={modalRef}
      isOpen={periodSelectorModalOpen}
      onClose={() => setPeriodSelectorModalOpen(false)}
    >
      <Header title="SELECT RANGE" closeButtonAction={handleClose} isModal />

      <View className="flex-1">
        {/* From / To chips */}
        <View
          className="flex-row items-center px-6 py-3.5 gap-2.5"
          style={{ borderBottomWidth: 1, borderBottomColor: C.rule }}
        >
          <View
            className="flex-1 px-3 py-2.5"
            style={{
              backgroundColor: C.paperHi,
              borderWidth: 1,
              borderColor: C.ink,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.monoSemi,
                fontSize: 9,
                lineHeight: 15,
                letterSpacing: 1.4,
                color: C.textMuted,
              }}
            >
              FROM
            </Text>
            <Text
              style={{
                fontFamily: FONTS.monoBold,
                fontSize: 13,
                lineHeight: 18,
                color: C.text,
                marginTop: 2,
              }}
            >
              {fmtChip(range.start)}
            </Text>
          </View>
          <Icon icon={ArrowRight} size={14} color={C.textMuted} />
          <View
            className="flex-1 px-3 py-2.5"
            style={{
              backgroundColor: range.end ? C.ink : C.paperHi,
              borderWidth: 1,
              borderColor: range.end ? C.ink : C.rule,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.monoSemi,
                fontSize: 9,
                lineHeight: 15,
                letterSpacing: 1.4,
                color: range.end ? C.textOnInkDim : C.textMuted,
              }}
            >
              TO
            </Text>
            <Text
              style={{
                fontFamily: FONTS.monoBold,
                fontSize: 13,
                lineHeight: 18,
                color: range.end ? C.textOnInk : C.textMute,
                marginTop: 2,
              }}
            >
              {range.end ? fmtChip(range.end) : '—'}
            </Text>
          </View>
        </View>

        {/* Presets */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 6 }}
          className="py-3"
          style={{ flexGrow: 0 }}
        >
          {PRESET_LABELS.map((label) => {
            const isActive = activePreset === label;
            return (
              <Pressable
                key={label}
                onPress={() => handlePresetPress(label)}
                className="px-3.5 py-2 active:opacity-70"
                style={{
                  backgroundColor: isActive ? C.red : C.paperHi,
                  borderWidth: 1,
                  borderColor: isActive ? C.red : C.rule,
                  borderRadius: 999,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.monoBold,
                    fontSize: 10,
                    lineHeight: 16,
                    letterSpacing: 1.6,
                    color: isActive ? C.textOnInk : C.text,
                    textTransform: 'uppercase',
                  }}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Month nav */}
        <View
          className="flex-row items-center justify-between px-6 py-2"
          style={{ borderBottomWidth: 1, borderBottomColor: C.rule }}
        >
          <Pressable
            onPress={() => stepMonth(-1)}
            hitSlop={8}
            className="items-center justify-center active:opacity-60"
            style={{
              width: 32,
              height: 32,
              borderWidth: 1,
              borderColor: C.rule,
              backgroundColor: C.paperHi,
            }}
          >
            <Icon icon={ChevronLeft} size={12} color={C.ink} />
          </Pressable>
          <Text
            style={{
              fontFamily: FONTS.monoBold,
              fontSize: 12,
              lineHeight: 18,
              letterSpacing: 2,
              color: C.text,
            }}
          >
            {anchorMonth.getFullYear()}
          </Text>
          <Pressable
            onPress={() => stepMonth(1)}
            hitSlop={8}
            className="items-center justify-center active:opacity-60"
            style={{
              width: 32,
              height: 32,
              borderWidth: 1,
              borderColor: C.rule,
              backgroundColor: C.paperHi,
            }}
          >
            <Icon icon={ChevronRight} size={12} color={C.ink} />
          </Pressable>
        </View>

        {/* Calendars (scrollable) */}
        <ScrollView
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 12 }}
          className="flex-1"
        >
          <MonthCalendar
            year={anchorMonth.getFullYear()}
            monthIdx={anchorMonth.getMonth()}
            today={today}
            range={range}
            onPressDay={handleDayPress}
          />
          <View
            style={{
              height: 1,
              backgroundColor: C.rule,
              marginHorizontal: 24,
              marginVertical: 12,
            }}
          />
          <MonthCalendar
            year={nextMonth.getFullYear()}
            monthIdx={nextMonth.getMonth()}
            today={today}
            range={range}
            onPressDay={handleDayPress}
          />
        </ScrollView>

        {/* Footer */}
        <View
          className="px-5 pt-3.5 pb-5"
          style={{
            borderTopWidth: 1,
            borderTopColor: C.rule,
            backgroundColor: C.paperHi,
          }}
        >
          <View className="flex-row items-center justify-between mb-2.5">
            <Text
              style={{
                fontFamily: FONTS.monoSemi,
                fontSize: 10,
                lineHeight: 16,
                letterSpacing: 1.4,
                color: C.textMuted,
              }}
            >
              SELECTION
            </Text>
            <Text
              style={{
                fontFamily: FONTS.monoSemi,
                fontSize: 12,
                lineHeight: 18,
                color: C.text,
              }}
            >
              {range.end ? `${selectionCount} day${selectionCount === 1 ? '' : 's'}` : 'Pick end date'}
            </Text>
          </View>
          <View className="flex-row gap-2.5">
            <Pressable
              onPress={handleReset}
              className="px-5 items-center justify-center active:opacity-70"
              style={{
                height: 52,
                borderWidth: 1,
                borderColor: C.ink,
                backgroundColor: 'transparent',
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.monoBold,
                  fontSize: 11,
                  lineHeight: 17,
                  letterSpacing: 1.8,
                  color: C.text,
                }}
              >
                RESET
              </Text>
            </Pressable>
            <Pressable
              onPress={handleApply}
              disabled={!range.end}
              className="flex-1 items-center justify-center active:opacity-80"
              style={{
                height: 52,
                backgroundColor: C.red,
                opacity: range.end ? 1 : 0.4,
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.monoBold,
                  fontSize: 12,
                  lineHeight: 18,
                  letterSpacing: 2.16,
                  color: C.textOnInk,
                }}
              >
                APPLY RANGE →
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ModalBase>
  );
};
