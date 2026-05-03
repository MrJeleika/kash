import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

import { AddTransactionModal } from '@/components/pages/add-transaction/add-transaction-modal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CurrenciesModal } from '@/components/pages/currencies/currencies-modal';
import { PeriodSelectorModal } from '@/components/pages/home/period-selector/period-selector-modal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NewCategoryModal } from '@/components/pages/categories/new-category-modal';
import { CategoriesModal } from '@/components/pages/categories/categories-modal';
import { useSession } from '@/hooks/auth/useSession';
import { useSyncWorker } from '@/hooks/sync/useSyncWorker';

const queryClient = new QueryClient();

const AuthGate = () => {
  const session = useSession();
  const segments = useSegments();
  useSyncWorker(session.status === 'authenticated');

  useEffect(() => {
    if (session.status === 'loading') return;
    const onAuthScreen = segments[0] === undefined || segments[0] === ('index' as any);
    if (session.status === 'authenticated' && onAuthScreen) {
      router.replace('/home');
    } else if (session.status === 'unauthenticated' && !onAuthScreen) {
      router.replace('/');
    }
  }, [session.status, segments]);

  return null;
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={DefaultTheme}>
          <StatusBar style="dark" />
          <View style={{ flex: 1, backgroundColor: '#C2B9A7' }}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#C2B9A7' },
              }}
            />
            <AuthGate />
            <AddTransactionModal />
            <CurrenciesModal />
            <PeriodSelectorModal />
            <CategoriesModal />
            <NewCategoryModal />
          </View>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
