import { Header } from '@/components/common/header';
import { ProfileCard } from '@/components/pages/settings/profile-card';
import { UsageMeter } from '@/components/pages/settings/usage-meter';
import { SettingsItem } from '@/components/pages/settings/settings-item';
import { SettingsSection } from '@/components/pages/settings/settings-section';
import { MonoLabel } from '@/components/ui/typography';
import { useModalsStore } from '@/store/modals';
import { useSettingsStore } from '@/store/settings';
import { useCurrencyStore } from '@/store/currency';
import {
  LayoutGrid,
  Sun,
  Mic,
  Upload,
  Lock,
  FileText,
  Trash2,
  LogOut,
} from 'lucide-react-native';
import { Alert, ScrollView, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/hooks/auth/useSession';
import { C, FONTS } from '@/utils/theme';

const APP_VERSION = 'v2.4.0';
const FALLBACK_EMAIL = 'kash@local';

const handleSignOut = () => {
  Alert.alert('Sign out', 'You can sign back in any time.', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Sign out',
      style: 'destructive',
      onPress: async () => {
        try {
          await supabase.auth.signOut({ scope: 'local' });
        } catch (err) {
          console.warn('[signOut] failed, forcing navigation anyway:', err);
        }
        router.replace('/');
      },
    },
  ]);
};

const handleDeleteLocalData = () => {
  Alert.alert(
    'Delete local data',
    'This clears every locally stored transaction and signs you out. Server data is unaffected.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          await AsyncStorage.clear();
          router.replace('/');
        },
      },
    ]
  );
};

export default function SettingsScreen() {
  const { setCurrenciesModalOpen, setCategoriesModalOpen } = useModalsStore();
  const { voiceLanguage } = useSettingsStore();
  const { currency } = useCurrencyStore();
  const session = useSession();
  const email =
    session.status === 'authenticated'
      ? session.session.user.email ?? FALLBACK_EMAIL
      : FALLBACK_EMAIL;

  return (
    <View className="flex-1" style={{ backgroundColor: C.paper }}>
      <Header
        backButton
        title="SETTINGS"
        actionButton={
          <Text
            style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              lineHeight: 16,
              letterSpacing: 1.4,
              color: C.textMuted,
            }}
          >
            {APP_VERSION}
          </Text>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileCard email={email} />
        <UsageMeter used={0} limit={10} />

        <View className="pt-4">
          <SettingsSection label="Money">
            <SettingsItem
              icon={Sun}
              label="Default currency"
              value={currency?.toUpperCase()}
              onPress={() => setCurrenciesModalOpen(true)}
            />
            <SettingsItem
              icon={LayoutGrid}
              label="Categories"
              onPress={() => setCategoriesModalOpen(true)}
            />
            <SettingsItem
              icon={Mic}
              label="Voice language"
              value={voiceLanguage}
              last
            />
          </SettingsSection>

          <SettingsSection label="Data">
            <SettingsItem
              icon={Upload}
              label="Export (CSV)"
              value="SOON"
              last
            />
          </SettingsSection>

          <SettingsSection label="About">
            <SettingsItem icon={Lock} label="Privacy policy" />
            <SettingsItem icon={FileText} label="Terms of use" last />
          </SettingsSection>

          <SettingsSection label="Danger Zone">
            <SettingsItem
              icon={LogOut}
              label="Sign out"
              variant="destructive"
              onPress={handleSignOut}
            />
            <SettingsItem
              icon={Trash2}
              label="Delete local data"
              variant="destructive"
              onPress={handleDeleteLocalData}
              last
            />
          </SettingsSection>

          <View className="px-6 pt-2 pb-10 items-center">
            <MonoLabel size={10} letterSpacing={1.8} color={C.textMute}>
              KASH · {APP_VERSION}
            </MonoLabel>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
