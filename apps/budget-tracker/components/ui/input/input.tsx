import { cn } from '@MrJeleika/utils';
import { TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  iconClassName?: string;
}

export const Input = ({
  icon,
  className,
  iconClassName,
  ...props
}: InputProps) => {
  return (
    <View className="relative">
      <TextInput
        placeholderTextColor="gray"
        textAlignVertical="bottom"
        className={cn(
          'bg-dark-gray border  leading-none text-white rounded-full px-4 py-3',
          className,
          icon && 'pl-11'
        )}
        {...props}
      />
      {icon && (
        <View
          className={cn(
            'left-4 absolute top-1/2 -translate-y-1/2',
            iconClassName
          )}
        >
          {icon}
        </View>
      )}
    </View>
  );
};
