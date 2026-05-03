import { View } from 'react-native';
import { KeyboardButton } from './keyboard-button';
import { Icon } from '../icon';
import { Delete } from 'lucide-react-native';

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
    <View className="flex flex-row flex-wrap gap-0.5">
      {Array.from({ length: 9 }).map((_, index) => (
        <KeyboardButton
          key={index}
          value={`${index + 1}`}
          onClick={() => onClick(`${index + 1}`)}
        />
      ))}
      <KeyboardButton
        value={`,`}
        className="bg-surface"
        onClick={() => onClick(`,`)}
      />
      <KeyboardButton value={`0`} onClick={() => onClick(`0`)} />
      <KeyboardButton
        icon={<Icon icon={Delete} className="text-text w-5" strokeWidth={3} />}
        className="bg-surface"
        onClick={() => onBackspace()}
        onLongPress={onLongPress}
      />
    </View>
  );
};
