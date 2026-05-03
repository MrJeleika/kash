import {
  Calendar as ReactNativeCalendar,
  CalendarProps as ReactNativeCalendarProps,
} from 'react-native-calendars';
import { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { cn } from '@/utils/shared';

interface CalendarProps extends ReactNativeCalendarProps {
  /** Enable year selection dropdown */
  enableYearSelection?: boolean;
  /** Range of years to show in year picker (default: current year ± 10) */
  yearRange?: { min: number; max: number };
}

export const Calendar = (props: CalendarProps) => {
  const {
    enableYearSelection = true,
    yearRange,
    current,
    onMonthChange,
    ...restProps
  } = props;

  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const minYear = yearRange?.min ?? currentYear - 10;
  const maxYear = yearRange?.max ?? currentYear + 10;
  const years = useMemo(() => {
    return Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  }, [minYear, maxYear]);

  const handleYearSelect = (year: number) => {
    setIsYearPickerOpen(false);

    // Update calendar to show the selected year (keeping current month)
    const currentDate = current ? new Date(current) : new Date();
    const newDate = new Date(year, currentDate.getMonth(), 1);
    const dateString = `${year}-${String(newDate.getMonth() + 1).padStart(
      2,
      '0'
    )}-01`;

    if (onMonthChange) {
      onMonthChange({
        dateString,
        day: 1,
        month: newDate.getMonth() + 1,
        year: newDate.getFullYear(),
        timestamp: newDate.getTime(),
      });
    }
  };

  const renderCustomHeader = (date?: any) => {
    if (!enableYearSelection || !date) {
      return null;
    }

    // XDate has toString method that accepts format, or we can convert to Date
    const dateObj = date instanceof Date ? date : new Date(date.toString());
    const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' });
    const year = dateObj.getFullYear();

    return (
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => setIsYearPickerOpen(!isYearPickerOpen)}
            className="flex-row items-center gap-1 px-3 py-1.5 rounded-lg bg-surface/50"
          >
            <Text className="text-text text-base font-medium">
              {monthName} {year}
            </Text>
            <Text className="text-text text-xs">▼</Text>
          </Pressable>
        </View>

        {isYearPickerOpen && (
          <View className="absolute top-full left-0 right-0 z-50 mt-2 mx-4 bg-surface rounded-xl border border-border max-h-48">
            <ScrollView className="max-h-48">
              {years.map((y) => (
                <Pressable
                  key={y}
                  onPress={() => handleYearSelect(y)}
                  className={cn(
                    'px-4 py-3 border-b border-border/50',
                    y === year && 'bg-surface/10'
                  )}
                >
                  <Text
                    className={cn(
                      'text-base',
                      y === year ? 'text-text font-semibold' : 'text-text-muted'
                    )}
                  >
                    {y}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  return (
    <ReactNativeCalendar
      style={{
        borderRadius: 16,
        backgroundColor: '#171717',
      }}
      theme={{
        backgroundColor: '#171717',
        calendarBackground: '#171717',
        dayTextColor: '#fff',
        selectedDayBackgroundColor: '#fff',
        selectedDayTextColor: '#000',
        arrowColor: '#fff',
      }}
      current={current}
      onMonthChange={onMonthChange}
      renderHeader={enableYearSelection ? renderCustomHeader : undefined}
      {...restProps}
    />
  );
};
