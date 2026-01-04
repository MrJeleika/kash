import { Header } from '@/components/common/header';
import { SafeInsert } from '@/components/common/safe-insert';
import { ActionButtons } from '@/components/pages/home/action-buttons';
import { TotalSpent } from '@/components/pages/home/total-spent/total-spent';
import { TransactionItem } from '@/components/pages/home/transactions/tranaction-item';
import { VoiceInput } from '@/components/pages/voice-input/voice-input';
import { Button } from '@/components/ui/button/button';
import { Icon } from '@/components/ui/icon';
import { ScrollViewWithFade } from '@/components/ui/scroll-view-with-fade';
import { useTransactionsStore } from '@/store/transactions';
import { groupTransactionsByDate } from '@/utils/transactions';
import { formatNumberWithSpaces } from '@MrJeleika/utils';
import { router } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  const { transactions } = useTransactionsStore();
  const groupedTransactions = groupTransactionsByDate(transactions);
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
        <TotalSpent />
        <View className="flex flex-col gap-4 mb-28">
          {groupedTransactions.map((group) => (
            <View key={group.date}>
              <View className="flex flex-row items-center justify-between  px-1 ">
                <Text className="text-secondary-text text-sm">
                  {group.date}
                </Text>
                <Text className="text-secondary-text text-sm">
                  {formatNumberWithSpaces(group.total.toString())}
                </Text>
              </View>
              <View className="flex flex-col gap-1">
                {group.transactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollViewWithFade>
      <ActionButtons />
      <VoiceInput />
    </View>
  );
}
