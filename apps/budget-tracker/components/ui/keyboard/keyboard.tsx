import { View } from 'react-native';
import { KeyboardButton } from './keyboard-button';
import { Icon } from '../icon';
import { Delete } from 'lucide-react-native';
import { C } from '@/utils/theme';

export interface KeyboardProps {
  onClick: (key: string) => void;
  onBackspace: () => void;
  onLongPress: () => void;
}

export const Keyboard = ({
  onClick,
  onBackspace,
  onLongPress,
}: KeyboardProps) => {
  return (
    <View style={{ gap: 8 }}>
      <View className="flex-row" style={{ gap: 8 }}>
        <KeyboardButton value="1" onClick={() => onClick('1')} />
        <KeyboardButton value="2" onClick={() => onClick('2')} />
        <KeyboardButton value="3" onClick={() => onClick('3')} />
      </View>
      <View className="flex-row" style={{ gap: 8 }}>
        <KeyboardButton value="4" onClick={() => onClick('4')} />
        <KeyboardButton value="5" onClick={() => onClick('5')} />
        <KeyboardButton value="6" onClick={() => onClick('6')} />
      </View>
      <View className="flex-row" style={{ gap: 8 }}>
        <KeyboardButton value="7" onClick={() => onClick('7')} />
        <KeyboardButton value="8" onClick={() => onClick('8')} />
        <KeyboardButton value="9" onClick={() => onClick('9')} />
      </View>
      <View className="flex-row" style={{ gap: 8 }}>
        <KeyboardButton value="." onClick={() => onClick(',')} dim />
        <KeyboardButton value="0" onClick={() => onClick('0')} />
        <KeyboardButton
          icon={<Icon icon={Delete} size={20} color={C.ink} strokeWidth={1.6} />}
          onClick={onBackspace}
          onLongPress={onLongPress}
          dim
        />
      </View>
    </View>
  );
};
