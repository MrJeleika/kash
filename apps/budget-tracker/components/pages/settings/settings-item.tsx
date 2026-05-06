import { ChevronRight, LucideIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { C, FONTS } from '@/utils/theme';

interface SettingsItemProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  onPress?: () => void;
  variant?: 'default' | 'destructive';
  last?: boolean;
}

export function SettingsItem({
  icon,
  label,
  value,
  onPress,
  variant = 'default',
  last = false,
}: SettingsItemProps) {
  const danger = variant === 'destructive';
  const fg = danger ? C.red : C.text;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-6 py-3.5 active:opacity-70"
      style={{
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: C.rule,
      }}
    >
      <View
        className="h-7 w-7 items-center justify-center mr-3"
        style={{
          backgroundColor: C.paper,
          borderWidth: 1,
          borderColor: C.rule,
        }}
      >
        <Icon icon={icon} size={14} color={fg} />
      </View>
      <Text
        className="flex-1"
        style={{
          fontFamily: FONTS.sansMedium,
          fontSize: 14,
          lineHeight: 20,
          color: fg,
        }}
      >
        {label}
      </Text>
      {value && (
        <Text
          className="mr-2"
          style={{
            fontFamily: FONTS.monoSemi,
            fontSize: 11,
            lineHeight: 17,
            letterSpacing: 1,
            color: C.textMuted,
          }}
        >
          {value}
        </Text>
      )}
      <Icon icon={ChevronRight} size={14} color={C.textMute} />
    </Pressable>
  );
}
