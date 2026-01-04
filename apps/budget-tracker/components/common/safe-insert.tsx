import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function SafeInsert({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { bottom, top, left, right } = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingBottom: bottom,
        paddingTop: top,
        paddingLeft: left + 4,
        paddingRight: right + 4,
      }}
      className={className}
    >
      {children}
    </View>
  );
}
