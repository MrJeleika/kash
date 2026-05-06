import { Pressable, ScrollView, Text, View } from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { MonthCalendar } from '@/components/ui/calendar/month-calendar';
import { ModalBase, ModalBaseRef } from '@/components/common/modal-base';
import { useModalsStore } from '@/store/modals';
import { C, FONTS } from '@/utils/theme';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  fromLocalDateKey,
  startOfDay,
  startOfMonth,
  toLocalDateKey,
} from '@/utils/format/dates';

const MONTH_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const dateKey = toLocalDateKey;

const offsetDate = (days: number) => {
  const d = startOfDay(new Date());
  d.setDate(d.getDate() + days);
  return d;
};

export const DateSelectSheet = () => {
  const modalRef = useRef<ModalBaseRef>(null);
  const { dateSheetOpen, dateSheetValue, dateSheetOnConfirm, closeDateSheet } =
    useModalsStore();

  const initial = useMemo(() => {
    const d = dateSheetValue ? fromLocalDateKey(dateSheetValue) : new Date();
    return startOfDay(d);
  }, [dateSheetValue]);

  const [selected, setSelected] = useState<Date>(initial);
  const [anchor, setAnchor] = useState<Date>(() => startOfMonth(initial));

  useEffect(() => {
    if (dateSheetOpen) {
      setSelected(initial);
      setAnchor(startOfMonth(initial));
    }
  }, [dateSheetOpen, initial]);

  const prevMonth = useMemo(() => {
    const m = new Date(anchor);
    m.setMonth(m.getMonth() - 1);
    return m;
  }, [anchor]);

  const today = startOfDay(new Date());
  const isToday = dateKey(selected) === dateKey(today);

  const stepMonth = (delta: number) => {
    const next = new Date(anchor);
    next.setMonth(next.getMonth() + delta);
    setAnchor(startOfMonth(next));
  };

  const presets = [
    { key: 'today', label: 'TODAY', date: offsetDate(0) },
    { key: 'yesterday', label: 'YESTERDAY', date: offsetDate(-1) },
    { key: 'two', label: '2 DAYS', date: offsetDate(-2) },
    { key: 'three', label: '3 DAYS', date: offsetDate(-3) },
  ];

  const handleClose = () => {
    modalRef.current?.close();
  };

  const handleConfirm = () => {
    dateSheetOnConfirm?.(dateKey(selected));
    modalRef.current?.close();
  };

  return (
    <ModalBase ref={modalRef} isOpen={dateSheetOpen} onClose={closeDateSheet}>
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-5 pt-3 pb-3"
        style={{ borderBottomWidth: 1, borderBottomColor: C.rule }}
      >
        <Pressable onPress={handleClose} hitSlop={10}>
          <Icon icon={X} size={20} color={C.ink} />
        </Pressable>
        <Text
          style={{
            fontFamily: FONTS.monoBold,
            fontSize: 12,
            lineHeight: 18,
            letterSpacing: 2.16,
            color: C.ink,
            textTransform: 'uppercase',
          }}
        >
          Transaction Date
        </Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Selected hero */}
      <View
        className="px-6 pt-4 pb-3.5"
        style={{ borderBottomWidth: 1, borderBottomColor: C.rule }}
      >
        <Text
          style={{
            fontFamily: FONTS.monoSemi,
            fontSize: 10,
            lineHeight: 16,
            letterSpacing: 1.4,
            color: C.textMuted,
            marginBottom: 4,
          }}
        >
          SELECTED
        </Text>
        <View className="flex-row items-baseline gap-3">
          <Text
            style={{
              fontFamily: FONTS.serif,
              fontSize: 40,
              lineHeight: 48,
              color: C.ink,
              letterSpacing: -0.8,
            }}
          >
            {MONTH_LONG[selected.getMonth()].slice(0, 3)} {selected.getDate()}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.monoSemi,
              fontSize: 13,
              lineHeight: 18,
              color: C.textMuted,
            }}
          >
            {selected.getFullYear()} · {DOW[selected.getDay()]}
          </Text>
          {isToday && (
            <View
              className="ml-auto px-2 py-0.5"
              style={{ backgroundColor: C.redDim }}
            >
              <Text
                style={{
                  fontFamily: FONTS.monoBold,
                  fontSize: 10,
                  lineHeight: 16,
                  letterSpacing: 1.2,
                  color: C.redDeep,
                }}
              >
                TODAY
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Quick presets */}
      <View
        className="flex-row"
        style={{ borderBottomWidth: 1, borderBottomColor: C.rule }}
      >
        {presets.map((p, i) => {
          const active = dateKey(selected) === dateKey(p.date);
          return (
            <Pressable
              key={p.key}
              onPress={() => {
                setSelected(p.date);
                setAnchor(startOfMonth(p.date));
              }}
              className="flex-1 items-center py-3.5 active:opacity-70"
              style={{
                borderRightWidth: i < presets.length - 1 ? 1 : 0,
                borderRightColor: C.rule,
                backgroundColor: active ? C.paperHi : 'transparent',
                gap: 4,
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.monoBold,
                  fontSize: 9,
                  lineHeight: 15,
                  letterSpacing: 1.4,
                  color: active ? C.red : C.textMuted,
                }}
              >
                {p.label}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.monoSemi,
                  fontSize: 12,
                  lineHeight: 18,
                  color: active ? C.ink : C.text,
                }}
              >
                {MONTH_LONG[p.date.getMonth()].slice(0, 3)} {p.date.getDate()}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Month nav */}
      <View className="flex-row items-center justify-between px-6 py-3">
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
            fontFamily: FONTS.serif,
            fontSize: 20,
            lineHeight: 26,
            color: C.ink,
            letterSpacing: -0.2,
          }}
        >
          {MONTH_LONG[anchor.getMonth()]} {anchor.getFullYear()}
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

      {/* Calendars */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 12 }}
        className="flex-1"
      >
        <MonthCalendar
          year={anchor.getFullYear()}
          monthIdx={anchor.getMonth()}
          today={today}
          single={selected}
          onPressDay={setSelected}
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
          year={prevMonth.getFullYear()}
          monthIdx={prevMonth.getMonth()}
          today={today}
          single={selected}
          onPressDay={(d) => {
            setSelected(d);
            setAnchor(startOfMonth(d));
          }}
        />
      </ScrollView>

      {/* Confirm */}
      <View
        className="px-5 pt-3 pb-5"
        style={{
          borderTopWidth: 1,
          borderTopColor: C.rule,
          backgroundColor: C.paperHi,
        }}
      >
        <Pressable
          onPress={handleConfirm}
          className="h-13 items-center justify-center active:opacity-80"
          style={{ height: 52, backgroundColor: C.ink }}
        >
          <Text
            style={{
              fontFamily: FONTS.monoBold,
              fontSize: 12,
              lineHeight: 18,
              letterSpacing: 2.64,
              color: C.textOnInk,
            }}
          >
            CONFIRM · {MONTH_LONG[selected.getMonth()].slice(0, 3).toUpperCase()}{' '}
            {selected.getDate()}
          </Text>
        </Pressable>
      </View>
    </ModalBase>
  );
};
