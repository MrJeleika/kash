import { Icon } from '@/components/ui/icon';
import { useModalsStore } from '@/store/modals';
import { useTransactionsStore } from '@/store/transactions';
import { CalendarDays } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';
import { C, FONTS } from '@/utils/theme';

export const PeriodSelectorTrigger = () => {
  const { setPeriodSelectorModalOpen } = useModalsStore();
  const { period: currentPeriod } = useTransactionsStore();
  return (
    <Pressable
      onPress={() => setPeriodSelectorModalOpen(true)}
      className="flex-row items-center gap-2 px-2 py-1.5 active:opacity-70"
      style={{
        backgroundColor: C.paperHi,
        borderWidth: 1,
        borderColor: C.rule,
      }}
    >
      <Icon icon={CalendarDays} size={12} color={C.text} />
      <Text
        style={{
          fontFamily: FONTS.monoSemi,
          fontSize: 10,
          lineHeight: 16,
          letterSpacing: 1,
          color: C.text,
          textTransform: 'uppercase',
        }}
      >
        {currentPeriod.label}
      </Text>
    </Pressable>
  );
};
