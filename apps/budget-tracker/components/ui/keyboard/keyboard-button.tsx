import { Text } from 'react-native';
import { Button } from '../button/button';
import { cn } from '@/utils/shared';

export interface KeyboardButtonProps {
  onClick: () => void;
  value?: string;
  icon?: React.ReactNode;
  className?: string;
  onLongPress?: () => void;
}

export const KeyboardButton = ({
  onClick,
  value,
  icon,
  className,
  onLongPress,
}: KeyboardButtonProps) => {
  return (
    <Button
      onLongPress={onLongPress}
      variant={'secondary'}
      className={cn(
        'flex rounded-2xl items-center justify-center py-6',
        className
      )}
      style={{ width: '33%' }}
      onPress={() => onClick()}
    >
      <Text className="text-text text-2xl font-normal">{value ?? icon}</Text>
    </Button>
  );
};
