import { Calendar } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';
import { Icon } from '@/components/ui/icon';

interface DateSelectorProps {
  date: string;
  onPress?: () => void;
}

export function DateSelector({ date, onPress }: DateSelectorProps) {
  const formatDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateObj.setHours(0, 0, 0, 0);

    if (dateObj.getTime() === today.getTime()) {
      return 'Today';
    }

    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };
    return dateObj.toLocaleDateString('en-US', options);
  };

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-center bg-zinc-900 rounded-2xl px-5 py-3 active:opacity-70"
    >
      <Icon icon={Calendar} className="text-white mr-2" size={18} />
      <Text className="text-white text-sm font-medium">{formatDate(date)}</Text>
    </Pressable>
  );
}
