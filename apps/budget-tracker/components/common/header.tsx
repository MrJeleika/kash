import { Pressable, Text, View } from 'react-native';
import { Icon } from '../ui/icon';
import { ChevronLeft, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  backButton?: boolean;
  closeButtonAction?: () => void;
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
  const insets = useSafeAreaInsets();
  const topPad = isModal ? 12 : insets.top + 4;

  return (
    <View
      style={{
        paddingTop: topPad,
        paddingBottom: 12,
        paddingHorizontal: 12,
        backgroundColor: '#C2B9A7',
        borderBottomWidth: 1,
        borderBottomColor: '#B5ADA0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ minWidth: 80, alignItems: 'flex-start' }}>
        {backButton && (
          <Pressable
            className="flex flex-row items-center"
            onPress={() => router.back()}
            hitSlop={8}
          >
            <Icon icon={ChevronLeft} size={22} color="#1A1918" />
            <Text>Back</Text>
          </Pressable>
        )}
        {closeButtonAction && (
          <Pressable
            onPress={closeButtonAction}
            hitSlop={8}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              padding: 4,
            })}
          >
            <Icon icon={X} size={22} color="#1A1918" />
          </Pressable>
        )}
      </View>

      <View style={{ flex: 1, alignItems: 'center' }}>
        {title && (
          <Text style={{ color: '#1A1918', fontSize: 17, fontWeight: '600' }}>
            {title}
          </Text>
        )}
        {centerElement}
      </View>

      <View style={{ minWidth: 80, alignItems: 'flex-end' }}>
        {actionButton}
      </View>
    </View>
  );
};
