import { cn } from '@MrJeleika/utils';
import { View } from 'react-native';

interface SettingsSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function SettingsSection({ children, className }: SettingsSectionProps) {
  return (
    <View
      className={cn('bg-zinc-900 rounded-2xl overflow-hidden mb-4', className)}
    >
      {children}
    </View>
  );
}
