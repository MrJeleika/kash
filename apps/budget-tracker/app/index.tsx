import { supabase } from '@/lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { makeRedirectUri } from 'expo-auth-session';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

/** Must match `scheme` in app.json and an entry in Supabase Auth → Redirect URLs */
const redirectTo = makeRedirectUri({
  scheme: 'kash',
  path: 'auth/callback',
});

function looksLikeOAuthReturn(url: string) {
  return /[?&#](code|error)=/.test(url);
}

export default function AuthScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const oauthHandledRef = useRef(false);

  const finalizeOAuthReturn = useCallback(
    async (url: string | null | undefined) => {
      if (!url || !looksLikeOAuthReturn(url)) return;
      if (oauthHandledRef.current) return;
      oauthHandledRef.current = true;

      WebBrowser.dismissBrowser();
      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(url);
      if (exchangeError) {
        oauthHandledRef.current = false;
        setError(exchangeError.message);
        setLoading(false);
        return;
      }
      router.replace('/home');
    },
    []
  );

  useEffect(() => {
    const onUrl = ({ url }: { url: string }) => {
      void finalizeOAuthReturn(url);
    };

    void Linking.getInitialURL().then((url) =>
      finalizeOAuthReturn(url ?? undefined)
    );

    const subscription = Linking.addEventListener('url', onUrl);
    return () => subscription.remove();
  }, [finalizeOAuthReturn]);

  const handleGoogleSignIn = async () => {
    oauthHandledRef.current = false;
    setLoading(true);
    setError(null);
    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
      });

      if (oauthError) throw oauthError;
      if (!data?.url) throw new Error('No OAuth URL returned');

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo
      );

      if (result.type !== 'success') {
        setLoading(false);
        return;
      }

      await finalizeOAuthReturn(result.url);
      setLoading(false);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Authentication failed';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background px-6 py-12 justify-between">
      {/* Header */}
      <View className="gap-1">
        <Text
          className="text-text font-black tracking-tight"
          style={{ fontSize: 52, lineHeight: 52 }}
        >
          KASH
        </Text>
        <Text className="text-text-muted text-xs tracking-widest uppercase">
          Digital{'\n'}Industrialism /{'\n'}V2.0.4
        </Text>
      </View>

      {/* Card */}
      <View className="bg-surface border border-border rounded-sm p-6 gap-6">
        {/* Status indicator */}
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 bg-accent" />
          <Text className="text-text-muted text-xs tracking-widest uppercase">
            System Ready
          </Text>
        </View>

        {/* Heading */}
        <View className="gap-3">
          <Text
            className="text-text font-bold leading-tight"
            style={{ fontSize: 28 }}
          >
            Initialize secure authentication protocol...
          </Text>
          <View className="h-px bg-border" />
        </View>

        {/* Google button */}
        <Pressable
          onPress={handleGoogleSignIn}
          disabled={loading}
          className="bg-accent active:bg-accent-hover rounded-sm py-4 px-6 flex-row items-center justify-between"
          style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1 })}
        >
          <Text className="text-background font-semibold text-base">
            Continue with Google
          </Text>
          {loading ? (
            <ActivityIndicator color="#D6D1C4" size="small" />
          ) : (
            <Text className="text-background font-bold text-lg">→</Text>
          )}
        </Pressable>

        {error && (
          <Text className="text-accent text-xs text-center">{error}</Text>
        )}

        {/* Manual bypass section */}
        <View className="gap-2">
          <Text className="text-text-muted text-xs tracking-widest uppercase">
            Manual Bypass
          </Text>
          <Text className="text-text text-sm">Corporate Identity Provider</Text>
        </View>

        {/* Technical footer */}
        <View className="gap-1 pt-2 border-t border-border">
          <Text className="text-text-muted" style={{ fontSize: 10 }}>
            RSA-4096 / AES-256-GCM / SHARED
          </Text>
          <Text className="text-text-muted" style={{ fontSize: 10 }}>
            LAT: 40.7128° N, LONG: 74.0060° W
          </Text>
        </View>
      </View>

      {/* Bottom status bar */}
      <View className="flex-row items-center justify-between flex-wrap gap-1">
        <View className="flex-row items-center gap-1">
          <Text className="text-text-muted uppercase tracking-widest text-xs">
            Status:{' '}
          </Text>
          <Text
            className="text-accent font-bold uppercase tracking-widest"
            style={{ fontSize: 10 }}
          >
            Encrypted
          </Text>
        </View>
        <Text
          className="text-text-muted uppercase tracking-widest"
          style={{ fontSize: 10 }}
        >
          Version: <Text className="text-text font-bold">K_ALPHA_8</Text>
        </Text>
        <Text
          className="text-text-muted uppercase tracking-widest"
          style={{ fontSize: 10 }}
        >
          Access: <Text className="text-text font-bold">GLOBAL-1</Text>
        </Text>
      </View>

      {/* Legal footer */}
      <View className="flex-row gap-4 justify-center">
        {['LEGAL', 'PRIVACY', 'SYSTEM LOG'].map((label) => (
          <Text
            key={label}
            className="text-text-muted"
            style={{ fontSize: 10 }}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}
