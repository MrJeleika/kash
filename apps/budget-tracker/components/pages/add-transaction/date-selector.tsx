import { Calendar } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { C, FONTS } from '@/utils/theme';

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
    return dateObj.toLocaleDateString('en-US', options).toUpperCase();
  };

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-2 px-3 py-2.5 active:opacity-70"
      style={{
        backgroundColor: C.paperHi,
        borderWidth: 1,
        borderColor: C.rule,
      }}
    >
      <Icon icon={Calendar} size={14} color={C.text} />
      <Text
        style={{
          fontFamily: FONTS.monoSemi,
          fontSize: 12,
          letterSpacing: 0.5,
          color: C.text,
        }}
      >
        {formatDate(date)}
      </Text>
    </Pressable>
  );
}
