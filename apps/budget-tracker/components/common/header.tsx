import { Pressable, Text, View } from 'react-native';
import { Icon } from '../ui/icon';
import { ChevronLeft, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, FONTS } from '@/utils/theme';

interface HeaderProps {
  backButton?: boolean;
  closeButtonAction?: () => void;
  title?: string;
  centerElement?: React.ReactNode;
  actionButton?: React.ReactNode;
  isModal?: boolean;
  variant?: 'page' | 'wordmark';
  subtitle?: string;
}

export const KashWordmark = ({ size = 18 }: { size?: number }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: size * 0.4 }}>
    <View style={{ width: size * 1.1, height: size * 0.18, backgroundColor: C.red }} />
    <Text
      style={{
        fontFamily: FONTS.monoBold,
        fontSize: size,
        lineHeight: Math.round(size * 1.2),
        letterSpacing: 0.04 * size,
        color: C.ink,
      }}
    >
      KASH
    </Text>
  </View>
);

export const Header = ({
  backButton,
  closeButtonAction,
  title,
  centerElement,
  actionButton,
  isModal = false,
  variant = 'page',
  subtitle,
}: HeaderProps) => {
  const insets = useSafeAreaInsets();
  const topPad = isModal ? 12 : insets.top + 4;

  return (
    <View
      style={{
        paddingTop: topPad,
        paddingBottom: 14,
        paddingHorizontal: 20,
        backgroundColor: C.paper,
        borderBottomWidth: 1,
        borderBottomColor: C.rule,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
        {closeButtonAction && (
          <Pressable
            onPress={closeButtonAction}
            hitSlop={10}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <Icon icon={X} size={20} color={C.ink} />
          </Pressable>
        )}

        {variant === 'wordmark' ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <KashWordmark size={15} />
            {(subtitle || title) && (
              <>
                <View style={{ width: 1, height: 14, backgroundColor: C.textMuted, opacity: 0.5 }} />
                <Text
                  style={{
                    fontFamily: FONTS.monoSemi,
                    fontSize: 11,
                    lineHeight: 17,
                    letterSpacing: 1.98,
                    color: C.textMuted,
                  }}
                >
                  {subtitle ?? title}
                </Text>
              </>
            )}
          </View>
        ) : backButton && !closeButtonAction ? (
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            className="flex-row items-center gap-3"
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <Icon icon={ChevronLeft} size={20} color={C.ink} />
            {title ? (
              <Text
                style={{
                  fontFamily: FONTS.monoBold,
                  fontSize: 12,
                  lineHeight: 18,
                  letterSpacing: 2.16,
                  color: C.ink,
                  textTransform: 'uppercase',
                }}
              >
                {title}
              </Text>
            ) : null}
          </Pressable>
        ) : title ? (
          <Text
            style={{
              fontFamily: FONTS.monoBold,
              fontSize: 12,
              lineHeight: 18,
              letterSpacing: 2.16,
              color: C.ink,
              textTransform: 'uppercase',
            }}
          >
            {title}
          </Text>
        ) : null}

        {centerElement}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        {actionButton}
      </View>
    </View>
  );
};
