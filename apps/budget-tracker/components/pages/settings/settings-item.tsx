import { cn } from '@/utils/shared';
import { LucideIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { Icon } from '@/components/ui/icon';

interface SettingsItemProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  onPress?: () => void;
  iconColor?: string;
  variant?: 'default' | 'destructive';
}

export function SettingsItem({
  icon,
  label,
  value,
  onPress,
  iconColor = 'text-text',
  variant = 'default',
}: SettingsItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-row items-center px-4 py-4 active:opacity-70',
        !value && 'justify-between'
      )}
    >
      <View className="flex-row items-center flex-1">
        <Icon
          icon={icon}
          className={cn(
            'mr-4',
            variant === 'destructive' ? 'text-danger' : iconColor
          )}
          size={20}
        />
        <Text
          className={cn(
            'text-base',
            variant === 'destructive' ? 'text-danger' : 'text-text'
          )}
        >
          {label}
        </Text>
      </View>
      {value && (
        <Text className="text-base text-text-muted ml-2">{value}</Text>
      )}
    </Pressable>
  );
}
