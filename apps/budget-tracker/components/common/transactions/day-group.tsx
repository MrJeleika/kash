import { Text, View } from 'react-native';
import { TransactionItem } from '@/components/pages/home/transactions/transaction-item';
import { Transaction } from '@/types/transactions';
import { useCurrencyStore } from '@/store/currency';
import { formatNumberWithSpaces } from '@/utils/shared';
import { C, FONTS } from '@/utils/theme';

interface DayGroupProps {
  date: string;
  total: number;
  transactions: Transaction[];
  /** Number of decimals shown on the day total (default 0). */
  decimals?: number;
}

export const DayGroup = ({
  date,
  total,
  transactions,
  decimals = 0,
}: DayGroupProps) => {
  const { currency } = useCurrencyStore();
  const totalLabel = formatNumberWithSpaces(Math.abs(total).toFixed(decimals));

  return (
    <View>
      <View
        className="flex-row items-center justify-between px-6 py-2"
        style={{ backgroundColor: C.paperDim }}
      >
        <Text
          style={{
            fontFamily: FONTS.monoSemi,
            fontSize: 10,
            letterSpacing: 1.8,
            color: C.text,
            textTransform: 'uppercase',
          }}
        >
          {date}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.monoSemi,
            fontSize: 10,
            letterSpacing: 1,
            color: C.textMuted,
          }}
        >
          −{totalLabel} {currency?.toUpperCase()}
        </Text>
      </View>
      {transactions.map((t, i) => (
        <TransactionItem key={t.id} transaction={t} index={i} />
      ))}
    </View>
  );
};
