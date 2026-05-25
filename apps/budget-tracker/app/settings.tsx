import { Header } from '@/components/common/header';
import { ProfileCard } from '@/components/pages/settings/profile-card';
import { UsageMeter } from '@/components/pages/settings/usage-meter';
import { SettingsItem } from '@/components/pages/settings/settings-item';
import { SettingsSection } from '@/components/pages/settings/settings-section';
import { MonoLabel } from '@/components/ui/typography';
import { useModalsStore } from '@/store/modals';
import { useSettingsStore } from '@/store/settings';
import { useCurrencyStore } from '@/store/currency';
import { getLanguageByCode } from '@/constants/languages';
import {
  LayoutGrid,
  Sun,
  Mic,
  Upload,
  Lock,
  FileText,
  Trash2,
  UserX,
  LogOut,
} from 'lucide-react-native';
import { Alert, Linking, ScrollView, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { apiDelete } from '@/lib/api';
import { useSession } from '@/hooks/auth/useSession';
import { useUsage } from '@/hooks/usage/useUsage';
import { C } from '@/utils/theme';
import { LEGAL_PRIVACY_URL, LEGAL_TERMS_URL } from '@/constants/legal';

const APP_VERSION = `v${Constants.expoConfig?.version ?? '0.0.0'}`;
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

const handleDeleteAccount = () => {
  Alert.alert(
    'Delete account',
    'This permanently deletes your account, every transaction, every category, and your usage history on our servers. This cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete account',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiDelete('/account');
          } catch (err: any) {
            Alert.alert(
              'Could not delete account',
              err?.message ?? 'Please try again later.'
            );
            return;
          }
          await supabase.auth.signOut();
          await AsyncStorage.clear();
          router.replace('/');
        },
      },
    ]
  );
};

const openLegal = (url: string) => {
  Linking.openURL(url).catch(() => {
    Alert.alert('Could not open link', 'Please try again later.');
  });
};

export default function SettingsScreen() {
  const { setCurrenciesModalOpen, setCategoriesModalOpen, setLanguagesModalOpen } =
    useModalsStore();
  const { voiceLocale } = useSettingsStore();
  const { currency } = useCurrencyStore();
  const voiceLanguageLabel =
    getLanguageByCode(voiceLocale)?.name ?? voiceLocale;
  const session = useSession();
  const email =
    session.status === 'authenticated'
      ? session.session.user.email ?? FALLBACK_EMAIL
      : FALLBACK_EMAIL;
  const { data: usage } = useUsage();

  return (
    <View className="flex-1" style={{ backgroundColor: C.paper }}>
      <Header backButton title="SETTINGS" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileCard email={email} />
        <UsageMeter used={usage?.used ?? 0} limit={usage?.limit ?? 10} />

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
              value={voiceLanguageLabel}
              onPress={() => setLanguagesModalOpen(true)}
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
            <SettingsItem
              icon={Lock}
              label="Privacy policy"
              onPress={() => openLegal(LEGAL_PRIVACY_URL)}
            />
            <SettingsItem
              icon={FileText}
              label="Terms of use"
              onPress={() => openLegal(LEGAL_TERMS_URL)}
              last
            />
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
            />
            <SettingsItem
              icon={UserX}
              label="Delete account"
              variant="destructive"
              onPress={handleDeleteAccount}
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
