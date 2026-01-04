import { cn } from '@MrJeleika/utils';
import { TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
}

export const Input = ({ icon, className, ...props }: InputProps) => {
  return (
    <View className="relative">
      <TextInput
        placeholderTextColor="gray"
        textAlignVertical="bottom"
        className={cn(
          'bg-light-gray border border-gray leading-none text-white rounded-full px-4 py-3',
          className,
          icon && 'pl-11'
        )}
        {...props}
      />
      {icon && (
        <View className="left-4 absolute top-1/2 -translate-y-1/2">{icon}</View>
      )}
    </View>
  );
};
