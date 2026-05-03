import { X } from 'lucide-react-native';
import { Button } from '../ui/button/button';
import { cn } from '@/utils/shared';
import { Icon } from '../ui/icon';

interface CloseButtonProps {
  onPress: () => void;
  className?: string;
}

export const CloseButton = ({ onPress, className }: CloseButtonProps) => {
  return (
    <Button
      onPress={onPress}
      variant="secondary"
      className={cn('size-[35px] rounded-full', className)}
    >
      <Icon icon={X} className="text-text" />
    </Button>
  );
};
