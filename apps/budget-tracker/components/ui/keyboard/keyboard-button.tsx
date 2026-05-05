import { Pressable, Text, View } from 'react-native';
import { C, FONTS } from '@/utils/theme';

export interface KeyboardButtonProps {
  onClick: () => void;
  value?: string;
  icon?: React.ReactNode;
  dim?: boolean;
  onLongPress?: () => void;
}

export const KeyboardButton = ({
  onClick,
  value,
  icon,
  dim = false,
  onLongPress,
}: KeyboardButtonProps) => {
  return (
    <Pressable
      onPress={onClick}
      onLongPress={onLongPress}
      className="items-center justify-center active:opacity-60"
      style={{
        flex: 1,
        height: 56,
        backgroundColor: dim ? 'transparent' : C.paperHi,
        borderWidth: dim ? 0 : 1,
        borderColor: C.rule,
      }}
    >
      {icon ? (
        <View>{icon}</View>
      ) : (
        <Text
          style={{
            fontFamily: FONTS.monoMedium,
            fontSize: 22,
            color: C.ink,
          }}
        >
          {value}
        </Text>
      )}
    </Pressable>
  );
};
