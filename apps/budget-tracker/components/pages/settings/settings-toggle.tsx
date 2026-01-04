import { cn } from '@MrJeleika/utils';
import { LucideIcon } from 'lucide-react-native';
import { Text, View, Switch } from 'react-native';
import { Icon } from '@/components/ui/icon';

interface SettingsToggleProps {
  icon: LucideIcon;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  iconColor?: string;
}

export function SettingsToggle({
  icon,
  label,
  value,
  onValueChange,
  iconColor = 'text-white',
}: SettingsToggleProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-4">
      <View className="flex-row items-center flex-1">
        <Icon icon={icon} className={cn('mr-4', iconColor)} size={24} />
        <Text className="text-base text-white">{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#3f3f46', true: '#22c55e' }}
        thumbColor={value ? '#ffffff' : '#ffffff'}
        ios_backgroundColor="#3f3f46"
      />
    </View>
  );
}
