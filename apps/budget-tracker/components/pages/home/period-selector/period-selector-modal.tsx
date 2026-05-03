import { Header } from '@/components/common/header';
import { ModalBase, ModalBaseRef } from '@/components/common/modal-base';
import { useModalsStore } from '@/store/modals';
import { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { getPeriodConfigs } from '@/constants/periods';
import { Button } from '@/components/ui/button/button';
import { PeriodConfig } from '@/types/periods';
import { useTransactionsStore } from '@/store/transactions';
import { cn } from '@MrJeleika/utils';
import { Calendar } from '@/components/ui/calendar/calendar';
import { DateData } from 'react-native-calendars';

export const PeriodSelectorModal = () => {
  const modalRef = useRef<ModalBaseRef>(null);
  const { setPeriod, period: currentPeriod } = useTransactionsStore();
  const { periodSelectorModalOpen, setPeriodSelectorModalOpen } =
    useModalsStore();

  const handleClose = () => {
    modalRef.current?.close();
  };

  const handlePeriodSelect = (period: PeriodConfig) => {
    handleClose();
    setPeriod(period);
  };
  const [selected, setSelected] = useState('');

  return (
    <ModalBase
      ref={modalRef}
      isOpen={periodSelectorModalOpen}
      onClose={() => setPeriodSelectorModalOpen(false)}
    >
      <Header title="Select period" closeButtonAction={handleClose} />
      <View className="pt-28 flex flex-col gap-4">
        <View className="flex flex-row flex-wrap gap-2 ">
          {getPeriodConfigs().map((period) => (
            <Button
              key={period.label}
              onPress={() => handlePeriodSelect(period)}
              variant={
                period.label === currentPeriod.label ? 'default' : 'secondary'
              }
              className="rounded-xl px-4 py-3"
            >
              <Text
                className={cn(
                  period.label === currentPeriod.label
                    ? 'text-text'
                    : 'text-text'
                )}
              >
                {period.label}
              </Text>
            </Button>
          ))}
        </View>
        {/* <Calendar
          onDayPress={(date) => setSelected(date.dateString)}
          markedDates={{
            [selected]: {
              selected: true,
            },
          }}
          className="rounded-xl bg-surface"
        /> */}
      </View>
    </ModalBase>
  );
};
