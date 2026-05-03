import { Button } from '@/components/ui/button/button';
import { Icon } from '@/components/ui/icon';
import { useModalsStore } from '@/store/modals';
import { useTransactionsStore } from '@/store/transactions';
import { CalendarDays } from 'lucide-react-native';
import { Text, View } from 'react-native';

export const PeriodSelectorTrigger = () => {
  const { setPeriodSelectorModalOpen } = useModalsStore();
  const { period: currentPeriod } = useTransactionsStore();
  return (
    <Button
      variant="secondary"
      className="rounded-full p-2"
      onPress={() => setPeriodSelectorModalOpen(true)}
    >
      <View className="flex flex-row items-center gap-1">
        <Icon icon={CalendarDays} className="text-text size-[14px]" />
        <Text className="text-text text-sm font-medium">
          {currentPeriod.label}
        </Text>
      </View>
    </Button>
  );
};
