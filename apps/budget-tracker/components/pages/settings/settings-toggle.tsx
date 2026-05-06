import { LucideIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { C, FONTS } from '@/utils/theme';

interface SettingsToggleProps {
  icon?: LucideIcon;
  label: string;
  sub?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  last?: boolean;
}

export function SettingsToggle({
  icon,
  label,
  sub,
  value,
  onValueChange,
  last = false,
}: SettingsToggleProps) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      className="flex-row items-center px-6 py-3.5 active:opacity-70"
      style={{
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: C.rule,
      }}
    >
      {icon && (
        <View
          className="h-7 w-7 items-center justify-center mr-3"
          style={{
            backgroundColor: C.paper,
            borderWidth: 1,
            borderColor: C.rule,
          }}
        >
          <Icon icon={icon} size={14} color={C.ink} />
        </View>
      )}
      <View className="flex-1">
        <Text
          style={{
            fontFamily: FONTS.sansMedium,
            fontSize: 14,
            lineHeight: 20,
            color: C.text,
          }}
        >
          {label}
        </Text>
        {sub && (
          <Text
            style={{
              fontSize: 11,
              lineHeight: 17,
              color: C.textMuted,
              marginTop: 2,
            }}
          >
            {sub}
          </Text>
        )}
      </View>
      <View
        style={{
          width: 38,
          height: 22,
          borderRadius: 999,
          backgroundColor: value ? C.red : C.paperDim,
          padding: 2,
        }}
      >
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 999,
            backgroundColor: C.paperHi,
            transform: [{ translateX: value ? 16 : 0 }],
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 1,
            shadowOffset: { width: 0, height: 1 },
          }}
        />
      </View>
    </Pressable>
  );
}
