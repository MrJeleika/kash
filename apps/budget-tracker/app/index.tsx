import { SafeInsert } from '@/components/common/safe-insert';
import { ActionButtons } from '@/components/pages/home/action-buttons';
import { TransactionItem } from '@/components/pages/home/transactions/tranaction-item';
import { VoiceInput } from '@/components/pages/voice-input/voice-input';
import { Button } from '@/components/ui/button/button';
import { Icon } from '@/components/ui/icon';
import { useTransactionsStore } from '@/store/transactions';
import { groupTransactionsByDate } from '@/utils/transactions';
import { router } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';

export default function HomeScreen() {
  const { getAllTransactions } = useTransactionsStore();
  const transactions = getAllTransactions();
  const groupedTransactions = groupTransactionsByDate(transactions);
  return (
    <SafeInsert className="relative h-full bg-black border">
      <View className="flex items-center flex-row justify-between">
        <View></View>
        <Button
          variant={'secondary'}
          className="rounded-full p-2"
          onPress={() => router.push('/settings')}
        >
          <Icon icon={Settings} className="text-white" />
        </Button>
      </View>
      <ScrollView className="">
        <View>
          {groupedTransactions.map((group) => (
            <View key={group.date}>
              <View className="flex flex-row items-center justify-between py-2">
                <Text className="text-white">{group.date}</Text>
                <Text className="text-white">{group.total}</Text>
              </View>
              {group.transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      <ActionButtons />
      <VoiceInput />
    </SafeInsert>
  );
}
