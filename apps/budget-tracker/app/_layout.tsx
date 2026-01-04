import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AddTransactionModal } from '@/components/pages/add-transaction/add-transaction-modal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CurrenciesModal } from '@/components/pages/currencies/currencies-modal';
import { PeriodSelectorModal } from '@/components/pages/home/period-selector/period-selector-modal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NewCategoryModal } from '@/components/pages/categories/new-category-modal';
import { CategoriesModal } from '@/components/pages/categories/categories-modal';

export default function RootLayout() {
  const queryClient = new QueryClient();
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
          </Stack>

          <AddTransactionModal />
          <CurrenciesModal />
          <PeriodSelectorModal />
          <CategoriesModal />
          <NewCategoryModal />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
