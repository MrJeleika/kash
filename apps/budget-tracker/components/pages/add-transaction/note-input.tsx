import { TextInput, TextInputProps, View } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { MessageSquare } from 'lucide-react-native';

export function NoteInput({ value, onChangeText, ...props }: TextInputProps) {
  return (
    <View className="bg-zinc-900 rounded-2xl px-4 py-3 flex-row items-center">
      <Icon icon={MessageSquare} className="text-zinc-500 mr-3" size={20} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Note"
        placeholderTextColor="#71717a"
        className="flex-1 text-white text-sm"
        {...props}
      />
    </View>
  );
}
