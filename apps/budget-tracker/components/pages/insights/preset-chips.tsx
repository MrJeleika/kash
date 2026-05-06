import { Pressable, ScrollView, Text } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { C, FONTS } from '@/utils/theme';

export interface Preset {
  key: string;
  label: string;
  icon?: 'calendar';
}

interface Props {
  presets: Preset[];
  active: string;
  onSelect: (key: string) => void;
}

export const PresetChips = ({ presets, active, onSelect }: Props) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: 24, gap: 6 }}
    className="py-3"
  >
    {presets.map((p) => {
      const isActive = active === p.key;
      return (
        <Pressable
          key={p.key}
          onPress={() => onSelect(p.key)}
          className="flex-row items-center gap-1.5 px-3.5 py-2 active:opacity-70"
          style={{
            backgroundColor: isActive ? C.ink : C.paperHi,
            borderWidth: 1,
            borderColor: isActive ? C.ink : C.rule,
            borderRadius: 999,
          }}
        >
          {p.icon === 'calendar' && (
            <Icon
              icon={Calendar}
              size={11}
              color={isActive ? C.textOnInk : C.text}
            />
          )}
          <Text
            style={{
              fontFamily: FONTS.monoBold,
              fontSize: 10,
              lineHeight: 16,
              letterSpacing: 1.6,
              color: isActive ? C.textOnInk : C.text,
              textTransform: 'uppercase',
            }}
          >
            {p.label}
          </Text>
        </Pressable>
      );
    })}
  </ScrollView>
);
