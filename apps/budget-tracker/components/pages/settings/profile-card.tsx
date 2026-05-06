import { Text, View } from 'react-native';
import { C, FONTS } from '@/utils/theme';

interface ProfileCardProps {
  email: string;
  tier?: string;
  showUpgrade?: boolean;
}

export function ProfileCard({ email, tier = 'Free tier', showUpgrade = true }: ProfileCardProps) {
  const username = email.split('@')[0];
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <View
      className="flex-row items-center gap-3.5 px-6 py-5"
      style={{ borderBottomWidth: 1, borderBottomColor: C.rule }}
    >
      <View
        className="h-14 w-14 items-center justify-center"
        style={{ backgroundColor: C.ink }}
      >
        <Text
          style={{
            fontFamily: FONTS.monoBold,
            fontSize: 20,
            lineHeight: 26,
            color: C.textOnInk,
            letterSpacing: 1,
          }}
        >
          {initials}
        </Text>
      </View>
      <View className="flex-1">
        <Text
          style={{
            fontFamily: FONTS.sansSemi,
            fontSize: 16,
            lineHeight: 22,
            color: C.text,
          }}
        >
          {username}
        </Text>
        <Text
          className="mt-0.5"
          style={{
            fontFamily: FONTS.mono,
            fontSize: 11,
            lineHeight: 17,
            color: C.textMuted,
          }}
        >
          {email} · {tier}
        </Text>
      </View>
      {showUpgrade && (
        <View className="px-2 py-1" style={{ backgroundColor: C.redDim }}>
          <Text
            style={{
              fontFamily: FONTS.monoBold,
              fontSize: 9,
              lineHeight: 15,
              letterSpacing: 1.2,
              color: C.redDeep,
            }}
          >
            UPGRADE
          </Text>
        </View>
      )}
    </View>
  );
}
