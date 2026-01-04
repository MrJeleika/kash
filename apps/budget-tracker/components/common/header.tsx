import { Text, View } from 'react-native';
import { Button } from '../ui/button/button';
import { Icon } from '../ui/icon';
import { ChevronLeft, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { cn } from '@MrJeleika/utils';

interface HeaderProps {
  backButton?: boolean;
  closeButtonAction?: () => void; // If provided, a close button will be shown in the top left
  title?: string;
  centerElement?: React.ReactNode;
  actionButton?: React.ReactNode;
  isModal?: boolean;
}

export const Header = ({
  backButton,
  closeButtonAction,
  title,
  centerElement,
  actionButton,
  isModal = false,
}: HeaderProps) => {
  return (
    <View
      className={cn(
        'absolute left-0 z-40 flex w-full items-center mb-5 flex-row justify-between',
        isModal ? 'top-0' : 'top-8'
      )}
    >
      <View className="w-[40px]">
        {backButton && (
          <Button
            variant={'secondary'}
            className="rounded-full p-2 items-center justify-center"
            onPress={() => router.back()}
          >
            <Icon icon={ChevronLeft} className="text-white" />
          </Button>
        )}
        {closeButtonAction && (
          <Button
            variant={'secondary'}
            className="rounded-full p-2"
            onPress={closeButtonAction}
          >
            <Icon icon={X} className="text-white" />
          </Button>
        )}
      </View>
      <View>
        {title && <Text className="font-medium text-white">{title}</Text>}
        {centerElement && <View>{centerElement}</View>}
      </View>
      <View className="w-[40px]">{actionButton}</View>
    </View>
  );
};
