import { Text } from 'react-native';
import { Button } from '../button/button';
import { cn } from '@MrJeleika/utils';

export interface KeyboardButtonProps {
  onClick: () => void;
  value?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const KeyboardButton = ({
  onClick,
  value,
  icon,
  className,
}: KeyboardButtonProps) => {
  return (
    <Button
      variant={'secondary'}
      className={cn(
        'flex rounded-2xl items-center justify-center py-6',
        className
      )}
      style={{ width: '33%' }}
      onPress={() => onClick()}
    >
      <Text className="text-white text-2xl font-normal">{value ?? icon}</Text>
    </Button>
  );
};
