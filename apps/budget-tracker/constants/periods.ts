import { PeriodConfig } from '@/types/periods';
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from '@/utils/format/dates';

const iso = (d: Date) => d.toISOString();

const EPOCH = new Date(1970, 0, 1);

/**
 * Built fresh on each call so "Today", "This Week" etc. reflect the current
 * clock — these are not stable constants.
 */
export const getPeriodConfigs = (): PeriodConfig[] => {
  const now = new Date();
  const today = startOfDay(now);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const last7Start = new Date(today);
  last7Start.setDate(last7Start.getDate() - 6);

  const last30Start = new Date(today);
  last30Start.setDate(last30Start.getDate() - 29);

  const lastMonthFirst = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthLast = new Date(today.getFullYear(), today.getMonth(), 0);

  const lastYearFirst = new Date(today.getFullYear() - 1, 0, 1);
  const lastYearLast = new Date(today.getFullYear() - 1, 11, 31);

  return [
    { label: 'Today', from: iso(startOfDay(today)), to: iso(endOfDay(today)) },
    {
      label: 'Yesterday',
      from: iso(startOfDay(yesterday)),
      to: iso(endOfDay(yesterday)),
    },
    {
      label: 'This Week',
      from: iso(startOfWeek(today)),
      to: iso(endOfWeek(today)),
    },
    {
      label: 'Last 7 Days',
      from: iso(startOfDay(last7Start)),
      to: iso(endOfDay(today)),
    },
    {
      label: 'Last 30 Days',
      from: iso(startOfDay(last30Start)),
      to: iso(endOfDay(today)),
    },
    {
      label: 'This Month',
      from: iso(startOfMonth(today)),
      to: iso(endOfMonth(today)),
    },
    {
      label: 'Last Month',
      from: iso(startOfMonth(lastMonthFirst)),
      to: iso(endOfMonth(lastMonthLast)),
    },
    {
      label: 'This Year',
      from: iso(startOfYear(today)),
      to: iso(endOfYear(today)),
    },
    {
      label: 'Last Year',
      from: iso(startOfYear(lastYearFirst)),
      to: iso(endOfYear(lastYearLast)),
    },
    {
      label: 'All Time',
      from: iso(startOfDay(EPOCH)),
      to: iso(endOfDay(now)),
    },
  ];
};
