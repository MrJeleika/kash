import { View } from 'react-native';
import { Eyebrow } from '@/components/ui/typography';
import { C } from '@/utils/theme';

interface SettingsSectionProps {
  children: React.ReactNode;
  label?: string;
}

export function SettingsSection({ children, label }: SettingsSectionProps) {
  return (
    <View className="mb-5">
      {label && <Eyebrow className="px-6 mb-2">{label}</Eyebrow>}
      <View
        style={{
          backgroundColor: C.paperHi,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: C.rule,
        }}
      >
        {children}
      </View>
    </View>
  );
}
