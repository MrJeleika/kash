import { supabase } from '@/lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { makeRedirectUri } from 'expo-auth-session';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { C, FONTS } from '@/utils/theme';
import { KashWordmark } from '@/components/common/header';

WebBrowser.maybeCompleteAuthSession();

/** Must match `scheme` in app.json and an entry in Supabase Auth → Redirect URLs */
const redirectTo = makeRedirectUri({
  scheme: 'kash',
  path: 'auth/callback',
});

function looksLikeOAuthReturn(url: string) {
  return /[?&#](code|error|access_token)=/.test(url);
}

function parseFragment(url: string): URLSearchParams {
  const hash = url.split('#')[1] ?? '';
  return new URLSearchParams(hash);
}

export default function AuthScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const oauthHandledRef = useRef(false);

  const finalizeOAuthReturn = useCallback(
    async (url: string | null | undefined) => {
      console.log('[oauth] finalizeOAuthReturn url=', url);
      if (!url || !looksLikeOAuthReturn(url)) {
        console.log('[oauth] skipping — not an oauth return');
        return;
      }
      if (oauthHandledRef.current) {
        console.log('[oauth] skipping — already handled');
        return;
      }
      oauthHandledRef.current = true;

      WebBrowser.dismissBrowser();

      const code = new URL(url).searchParams.get('code');
      if (code) {
        console.log('[oauth] exchanging code for session…');
        const { data, error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          console.log('[oauth] exchange failed:', exchangeError.message);
          oauthHandledRef.current = false;
          setError(exchangeError.message);
          setLoading(false);
          return;
        }
        console.log('[oauth] session ok, user=', data.session?.user?.id);
        setLoading(false);
        router.replace('/home');
        return;
      }

      const fragment = parseFragment(url);
      const accessToken = fragment.get('access_token');
      const refreshToken = fragment.get('refresh_token');
      if (accessToken && refreshToken) {
        console.log('[oauth] setting session from implicit-flow tokens…');
        const { data, error: setErr } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (setErr) {
          console.log('[oauth] setSession failed:', setErr.message);
          oauthHandledRef.current = false;
          setError(setErr.message);
          setLoading(false);
          return;
        }
        console.log('[oauth] session ok, user=', data.session?.user?.id);
        setLoading(false);
        router.replace('/home');
        return;
      }

      oauthHandledRef.current = false;
      setError('OAuth response missing tokens');
      setLoading(false);
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

      console.log('[oauth] redirectTo=', redirectTo);
      console.log('[oauth] auth url=', data.url);

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo
      );

      console.log('[oauth] WebBrowser result:', JSON.stringify(result));

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
    <View
      className="flex-1 px-7 pt-16 pb-10 justify-between"
      style={{ backgroundColor: C.paper }}
    >
      {/* Top: Wordmark + version */}
      <View className="flex-row items-center justify-between">
        <KashWordmark size={20} />
        <Text
          style={{
            fontFamily: FONTS.mono,
            fontSize: 10,
            letterSpacing: 1.8,
            color: C.textMuted,
          }}
        >
          v2.4.0
        </Text>
      </View>

      {/* Editorial headline */}
      <View>
        <Text
          className="mb-4"
          style={{
            fontFamily: FONTS.monoSemi,
            fontSize: 10,
            letterSpacing: 1.4,
            color: C.textMuted,
            textTransform: 'uppercase',
          }}
        >
          —— Access ledger · 001
        </Text>
        <Text
          style={{
            fontFamily: FONTS.serif,
            fontSize: 56,
            lineHeight: 56 * 0.95,
            color: C.ink,
            letterSpacing: -1.1,
          }}
        >
          Money,{'\n'}
          <Text style={{ fontFamily: FONTS.serifItalic }}>quietly</Text>
          {'\n'}accounted for.
        </Text>
        <Text
          className="mt-5"
          style={{
            fontSize: 14,
            color: C.textMuted,
            lineHeight: 21,
            maxWidth: 290,
          }}
        >
          Voice it, snap it, type it. Kash files every coin in the right column —
          so you don't have to.
        </Text>
      </View>

      {/* Auth */}
      <View className="gap-3">
        <Pressable
          onPress={handleGoogleSignIn}
          disabled={loading}
          className="h-14 flex-row items-center justify-center gap-2.5"
          style={({ pressed }) => ({
            backgroundColor: C.paperHi,
            borderWidth: 1,
            borderColor: C.rule,
            borderRadius: 4,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          {loading ? (
            <ActivityIndicator color={C.ink} size="small" />
          ) : (
            <>
              <Text style={{ fontSize: 14 }}>𝙶</Text>
              <Text
                style={{
                  fontFamily: FONTS.monoSemi,
                  fontSize: 12,
                  letterSpacing: 1.92,
                  color: C.ink,
                }}
              >
                CONTINUE WITH GOOGLE
              </Text>
            </>
          )}
        </Pressable>

        {error && (
          <Text
            style={{
              fontFamily: FONTS.mono,
              fontSize: 11,
              color: C.red,
              textAlign: 'center',
            }}
          >
            {error}
          </Text>
        )}

        <Text
          className="mt-2 text-center"
          style={{
            fontSize: 11,
            color: C.textMute,
            lineHeight: 17,
          }}
        >
          By continuing you agree to our{' '}
          <Text style={{ color: C.text, textDecorationLine: 'underline' }}>
            Terms
          </Text>{' '}
          and{' '}
          <Text style={{ color: C.text, textDecorationLine: 'underline' }}>
            Privacy
          </Text>
          .
        </Text>
      </View>
    </View>
  );
}
