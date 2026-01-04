import { Header } from '@/components/common/header';
import { SafeInsert } from '@/components/common/safe-insert';
import { SettingsItem } from '@/components/pages/settings/settings-item';
import { SettingsSection } from '@/components/pages/settings/settings-section';
import { SettingsToggle } from '@/components/pages/settings/settings-toggle';
import { useModalsStore } from '@/store/modals';
import { useSettingsStore } from '@/store/settings';
import { useCurrencyStore } from '@/store/currency';
import {
  Crown,
  LayoutGrid,
  Sun,
  Mic,
  TrendingDown,
  Coins,
  Upload,
  Heart,
  Mail,
  Lock,
  FileText,
  Trash2,
} from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';

export default function SettingsScreen() {
  const { setCurrenciesModalOpen } = useModalsStore();
  const {
    alwaysShowIncomes,
    roundTotals,
    setAlwaysShowIncomes,
    setRoundTotals,
    voiceLanguage,
  } = useSettingsStore();
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

  const handleDeleteAccountPress = () => {
    // TODO: Implement delete account
    console.log('Delete user account');
  };

  const handleExportPress = () => {
    // TODO: Implement CSV export
    console.log('Export CSV');
  };

  const handleCategoriesPress = () => {
    // TODO: Navigate to categories screen
    console.log('Categories');
  };

  const handleVoiceLanguagePress = () => {
    // TODO: Navigate to voice language selection
    console.log('Voice Language');
  };

  return (
    <SafeInsert className="relative h-full bg-black">
      <Header title="Settings" backButton />
      <ScrollView className="pt-20 px-4" showsVerticalScrollIndicator={false}>
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
          <SettingsToggle
            icon={TrendingDown}
            label="Always show incomes"
            value={alwaysShowIncomes}
            onValueChange={setAlwaysShowIncomes}
          />
          <SettingsToggle
            icon={Coins}
            label="Round totals"
            value={roundTotals}
            onValueChange={setRoundTotals}
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
          <View className="h-[1px] bg-zinc-800 ml-14" />
          <SettingsItem
            icon={Mail}
            label="Help & Support"
            onPress={handleSupportPress}
          />
          <View className="h-[1px] bg-zinc-800 ml-14" />
          <SettingsItem
            icon={Lock}
            label="Privacy Policy"
            onPress={handlePrivacyPress}
          />
          <View className="h-[1px] bg-zinc-800 ml-14" />
          <SettingsItem
            icon={FileText}
            label="Terms of Use"
            onPress={handleTermsPress}
          />
        </SettingsSection>

        {/* Delete Account Section */}
        <SettingsSection>
          <SettingsItem
            icon={Trash2}
            label="Delete user account"
            variant="destructive"
            onPress={handleDeleteAccountPress}
          />
        </SettingsSection>
      </ScrollView>
    </SafeInsert>
  );
}
