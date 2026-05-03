import { useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { AppState, type AppStateStatus } from 'react-native';
import { pushPendingChanges } from '@/lib/sync';
import { useTransactionsStore } from '@/store/transactions';
import { useCategoriesStore } from '@/store/categories';

const DEBOUNCE_MS = 1500;

/**
 * Background push-only sync worker.
 *
 * Triggers a flush attempt on:
 *   1. Mount (cold start)
 *   2. Returning to foreground
 *   3. Network reconnect (offline → online)
 *   4. Local mutation (debounced 1.5s after the last edit)
 *
 * Failures are tolerated — the dirty rows will be retried on the next trigger.
 */
export const useSyncWorker = (enabled: boolean) => {
  const inFlight = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOnline = useRef(true);

  useEffect(() => {
    if (!enabled) return;

    const flush = async () => {
      if (inFlight.current || !isOnline.current) return;
      inFlight.current = true;
      try {
        const result = await pushPendingChanges();
        if (result.errors.length) {
          console.warn('[sync] push errors', result.errors);
        }
      } catch (err) {
        console.warn('[sync] push failed', err);
      } finally {
        inFlight.current = false;
      }
    };

    const scheduleFlush = () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(flush, DEBOUNCE_MS);
    };

    flush();

    const netUnsub = NetInfo.addEventListener((state) => {
      const online = !!state.isConnected && state.isInternetReachable !== false;
      const transitionedToOnline = !isOnline.current && online;
      isOnline.current = online;
      if (transitionedToOnline) flush();
    });

    const appStateSub = AppState.addEventListener(
      'change',
      (next: AppStateStatus) => {
        if (next === 'active') flush();
      }
    );

    const txUnsub = useTransactionsStore.subscribe(scheduleFlush);
    const catUnsub = useCategoriesStore.subscribe(scheduleFlush);

    return () => {
      netUnsub();
      appStateSub.remove();
      txUnsub();
      catUnsub();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [enabled]);
};
