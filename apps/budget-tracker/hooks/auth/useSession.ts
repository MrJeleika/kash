import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type SessionState =
  | { status: 'loading'; session: null }
  | { status: 'unauthenticated'; session: null }
  | { status: 'authenticated'; session: Session };

/**
 * Reads the cached Supabase session from AsyncStorage on mount.
 *
 * - Returns `loading` for the brief moment between cold start and the cache read.
 * - Treats TOKEN_REFRESHED / USER_UPDATED as no-ops (no re-render storms,
 *   no surprise routing). Only SIGNED_IN / SIGNED_OUT change the gate.
 * - Network errors during refresh do NOT sign the user out — Supabase JS
 *   keeps the cached session and retries.
 */
export const useSession = (): SessionState => {
  const [state, setState] = useState<SessionState>({
    status: 'loading',
    session: null,
  });

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setState(
        data.session
          ? { status: 'authenticated', session: data.session }
          : { status: 'unauthenticated', session: null }
      );
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setState({ status: 'authenticated', session });
      } else if (event === 'SIGNED_OUT') {
        setState({ status: 'unauthenticated', session: null });
      } else if (
        (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') &&
        session
      ) {
        // Update the cached session object but keep status the same.
        setState((prev) =>
          prev.status === 'authenticated'
            ? { status: 'authenticated', session }
            : prev
        );
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
};
