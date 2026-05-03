import { cn } from '@MrJeleika/utils';
import { Platform, TextInput, TextInputProps, View } from 'react-native';

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
        className={cn(
          'dark:bg-input/30 rounded-xl bg-surface text-text flex h-10 w-full min-w-0 flex-row items-center px-3 py-1 text-base leading-5 shadow-sm shadow-black/5 sm:h-9',
          props.editable === false &&
            cn(
              'opacity-50',
              Platform.select({
                web: 'disabled:pointer-events-none disabled:cursor-not-allowed',
              })
            ),
          Platform.select({
            web: cn(
              'placeholder:text-text-muted selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
            ),
            native: 'placeholder:text-text-muted/50',
          }),
          icon && 'pl-11',
          className
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
