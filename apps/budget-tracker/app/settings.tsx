import { Header } from '@/components/common/header';
import { SafeInsert } from '@/components/common/safe-insert';
import { SettingsItem } from '@/components/pages/settings/settings-item';
import { SettingsSection } from '@/components/pages/settings/settings-section';
import { useModalsStore } from '@/store/modals';
import { useSettingsStore } from '@/store/settings';
import { useCurrencyStore } from '@/store/currency';
import {
  LayoutGrid,
  Sun,
  Mic,
  Upload,
  Heart,
  Mail,
  Lock,
  FileText,
  Trash2,
  LogOut,
} from 'lucide-react-native';
import { Alert, ScrollView, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function SettingsScreen() {
  const { setCurrenciesModalOpen, setCategoriesModalOpen } = useModalsStore();
  const { voiceLanguage } = useSettingsStore();
  const { currency } = useCurrencyStore();

  const handleReviewPress = () => {
    // TODO: Implement App Store review
    console.log('Review in App Store');
  };

  const handleSupportPress = () => {
    // TODO: Implement support email
    console.log('Help & Support');
  };

  const handlePrivacyPress = () => {
    // TODO: Implement privacy policy link
    console.log('Privacy Policy');
  };

  const handleTermsPress = () => {
    // TODO: Implement terms of use link
    console.log('Terms of Use');
  };

  const handleSignOut = async () => {
    Alert.alert('Sign out', 'You can sign back in any time.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace('/');
        },
      },
    ]);
  };

  const handleDeleteAccountPress = async () => {
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

  const handleExportPress = () => {
    // TODO: Implement CSV export
    console.log('Export CSV');
  };

  const handleCategoriesPress = () => {
    setCategoriesModalOpen(true);
  };

  const handleVoiceLanguagePress = () => {
    // TODO: Navigate to voice language selection
    console.log('Voice Language');
  };

  return (
    <SafeInsert className="relative h-full bg-background">
      <Header title="Settings" backButton />
      <ScrollView showsVerticalScrollIndicator={false}>
        <SettingsSection>
          <SettingsItem
            icon={LayoutGrid}
            label="Categories"
            onPress={handleCategoriesPress}
          />
          <SettingsItem
            icon={Sun}
            label="Default currency"
            value={currency.toUpperCase()}
            onPress={() => setCurrenciesModalOpen(true)}
          />
          <SettingsItem
            icon={Mic}
            label="Voice Language"
            value={voiceLanguage}
            onPress={handleVoiceLanguagePress}
          />
        </SettingsSection>

        {/* Export Section */}
        <SettingsSection>
          <SettingsItem
            icon={Upload}
            label="Export (CSV)"
            onPress={handleExportPress}
          />
        </SettingsSection>

        {/* Support & Legal Section */}
        <SettingsSection>
          <SettingsItem
            icon={Heart}
            label="Review in App Store"
            onPress={handleReviewPress}
          />
          <View className="h-[1px] bg-border ml-14" />
          <SettingsItem
            icon={Mail}
            label="Help & Support"
            onPress={handleSupportPress}
          />
          <View className="h-[1px] bg-border ml-14" />
          <SettingsItem
            icon={Lock}
            label="Privacy Policy"
            onPress={handlePrivacyPress}
          />
          <View className="h-[1px] bg-border ml-14" />
          <SettingsItem
            icon={FileText}
            label="Terms of Use"
            onPress={handleTermsPress}
          />
        </SettingsSection>

        {/* Account Section */}
        <SettingsSection>
          <SettingsItem
            icon={LogOut}
            label="Sign out"
            onPress={handleSignOut}
          />
          <View className="h-[1px] bg-border ml-14" />
          <SettingsItem
            icon={Trash2}
            label="Delete local data"
            variant="destructive"
            onPress={handleDeleteAccountPress}
          />
        </SettingsSection>
      </ScrollView>
    </SafeInsert>
  );
}
