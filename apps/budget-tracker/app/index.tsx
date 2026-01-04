import { Header } from '@/components/common/header';
import { ActionButtons } from '@/components/pages/home/action-buttons';
import { TotalSpent } from '@/components/pages/home/total-spent/total-spent';
import { TransactionItem } from '@/components/pages/home/transactions/tranaction-item';
import { VoiceInput } from '@/components/pages/voice-input/voice-input';
import { Button } from '@/components/ui/button/button';
import { Icon } from '@/components/ui/icon';
import { ScrollViewWithFade } from '@/components/ui/scroll-view-with-fade';
import { useTransactions } from '@/hooks/transactions/useTransactions';
import { useCurrencyStore } from '@/store/currency';
import { formatNumberWithSpaces } from '@MrJeleika/utils';
import { router } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  const groupedTransactions = useTransactions();
  const { currency } = useCurrencyStore();
  return (
    <View className="relative h-full bg-black">
      <Header
        actionButton={
          <Button
            variant={'secondary'}
            onPress={() => router.push('/settings')}
            className="rounded-full p-2"
          >
            <Icon icon={Settings} className="text-white" />
          </Button>
        }
      />
      <ScrollViewWithFade fadeLength={100} className="pt-28">
        <TotalSpent groupedTransactions={groupedTransactions} />
        {groupedTransactions.length > 0 && (
          <View className="flex flex-col gap-4 mb-28">
            {groupedTransactions.map((group) => (
              <View key={group.date}>
                <View className="flex flex-row items-center justify-between  px-1 ">
                  <Text className="text-secondary-text text-sm">
                    {group.date}
                  </Text>
                  <Text className="text-secondary-text text-sm">
                    {formatNumberWithSpaces(group.total.toString())}{' '}
                    {currency?.toUpperCase()}
                  </Text>
                </View>
                <View className="flex flex-col gap-1">
                  {group.transactions.map((transaction, index) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                      index={index}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
        {groupedTransactions.length === 0 && (
          <View className="flex flex-col items-center justify-center h-[50vh]">
            <Text className="text-secondary-text font-semibold">
              No transactions for this period
            </Text>
          </View>
        )}
      </ScrollViewWithFade>
      <ActionButtons />
      <VoiceInput />
    </View>
  );
}
