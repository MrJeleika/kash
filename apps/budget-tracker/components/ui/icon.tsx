import { cn } from '@/utils/shared';
import { LucideIcon, LucideProps } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { Platform, View } from 'react-native';

type IconProps = LucideProps & {
  icon: LucideIcon;
};

const interopRegistered = new WeakSet<LucideIcon>();

export function iconWithClassName(icon: LucideIcon) {
  if (interopRegistered.has(icon)) return;
  cssInterop(icon, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
        opacity: true,
        width: true,
        height: true,
      },
    },
  });
  interopRegistered.add(icon);
}

export const Icon = ({ icon: LucideIcon, className, ...props }: IconProps) => {
  iconWithClassName(LucideIcon);

  const iconClassName = Platform.select({
    native: className,
  });

  const viewClassName = Platform.select({
    web: cn('[&>svg]:size-full', className),
  });

  return (
    <View className={viewClassName}>
      <LucideIcon className={iconClassName} {...props} />
    </View>
  );
};
