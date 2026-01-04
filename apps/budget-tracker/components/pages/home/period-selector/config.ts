import { PeriodConfig } from '@/types/periods';

/**
 * Returns an array of predefined period configurations
 * Each item includes a label and date range (from/to) as ISO string dates
 */
export function getPeriodConfigs(): PeriodConfig[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Helper function to format date as ISO string (YYYY-MM-DDTHH:mm:ss.sssZ)
  const toISOString = (date: Date): string => {
    return date.toISOString();
  };

  // Helper function to get start of day
  const startOfDay = (date: Date): Date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Helper function to get end of day
  const endOfDay = (date: Date): Date => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  };

  // Helper function to get start of week (Monday)
  const startOfWeek = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    d.setDate(diff);
    return startOfDay(d);
  };

  // Helper function to get end of week (Sunday)
  const endOfWeek = (date: Date): Date => {
    const d = startOfWeek(date);
    d.setDate(d.getDate() + 6);
    return endOfDay(d);
  };

  // Helper function to get start of month
  const startOfMonth = (date: Date): Date => {
    return startOfDay(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  // Helper function to get end of month
  const endOfMonth = (date: Date): Date => {
    return endOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0));
  };

  // Helper function to get start of year
  const startOfYear = (date: Date): Date => {
    return startOfDay(new Date(date.getFullYear(), 0, 1));
  };

  // Helper function to get end of year
  const endOfYear = (date: Date): Date => {
    return endOfDay(new Date(date.getFullYear(), 11, 31));
  };

  // Yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Last 7 days
  const last7DaysStart = new Date(today);
  last7DaysStart.setDate(last7DaysStart.getDate() - 6); // Include today, so 6 days back

  // Last 30 days
  const last30DaysStart = new Date(today);
  last30DaysStart.setDate(last30DaysStart.getDate() - 29); // Include today, so 29 days back

  // Last month
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  // Last year
  const lastYear = new Date(today.getFullYear() - 1, 0, 1);
  const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);

  // All time - use a very early date (January 1, 1970)
  const allTimeStart = new Date(1970, 0, 1);

  return [
    {
      label: 'Today',
      from: toISOString(startOfDay(today)),
      to: toISOString(endOfDay(today)),
    },
    {
      label: 'Yesterday',
      from: toISOString(startOfDay(yesterday)),
      to: toISOString(endOfDay(yesterday)),
    },
    {
      label: 'This Week',
      from: toISOString(startOfWeek(today)),
      to: toISOString(endOfWeek(today)),
    },
    {
      label: 'Last 7 Days',
      from: toISOString(startOfDay(last7DaysStart)),
      to: toISOString(endOfDay(today)),
    },
    {
      label: 'Last 30 Days',
      from: toISOString(startOfDay(last30DaysStart)),
      to: toISOString(endOfDay(today)),
    },
    {
      label: 'This Month',
      from: toISOString(startOfMonth(today)),
      to: toISOString(endOfMonth(today)),
    },
    {
      label: 'Last Month',
      from: toISOString(startOfMonth(lastMonth)),
      to: toISOString(endOfMonth(lastMonthEnd)),
    },
    {
      label: 'This Year',
      from: toISOString(startOfYear(today)),
      to: toISOString(endOfYear(today)),
    },
    {
      label: 'Last Year',
      from: toISOString(startOfYear(lastYear)),
      to: toISOString(endOfYear(lastYearEnd)),
    },
    {
      label: 'All Time',
      from: toISOString(startOfDay(allTimeStart)),
      to: toISOString(endOfDay(now)),
    },
  ];
}
