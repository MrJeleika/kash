import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function SafeInsert({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { left, right } = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingLeft: left + 4,
        paddingRight: right + 4,
      }}
      className={className}
    >
      {children}
    </View>
  );
}
