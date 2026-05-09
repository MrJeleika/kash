import { useCallback, useEffect, useReducer, useRef } from 'react';
import { useTranscribeToTransactions } from '@/hooks/voice/useTranscribeToTransactions';
import { useCurrencyStore } from '@/store/currency';
import { useModalsStore } from '@/store/modals';
import { useSettingsStore } from '@/store/settings';
import {
  initialContext,
  ParsedItem,
  voiceReducer,
  VoiceContext,
  VoiceEvent,
} from './state';

let ExpoSpeechRecognitionModule: any = null;
let useSpeechRecognitionEvent: any = null;
try {
  const m = require('expo-speech-recognition');
  ExpoSpeechRecognitionModule = m.ExpoSpeechRecognitionModule;
  useSpeechRecognitionEvent = m.useSpeechRecognitionEvent;
} catch {}

const isMockMode = !ExpoSpeechRecognitionModule;

const MOCK_TRANSCRIPTS = [
  'Spent 50 dollars on groceries',
  'Paid 20 for lunch at restaurant',
  'Received 100 from salary',
  'Coffee 5 dollars',
];

export type VoiceMachine = {
  ctx: VoiceContext;
  dispatch: React.Dispatch<VoiceEvent>;
};

export function useVoiceMachine(open: boolean): VoiceMachine {
  const [ctx, dispatch] = useReducer(voiceReducer, initialContext);
  const { mutateAsync: transcribe } = useTranscribeToTransactions();
  const defaultCurrency = useCurrencyStore((s) => s.currency);
  const voiceLocale = useSettingsStore((s) => s.voiceLocale);
  const setVoiceState = useModalsStore((s) => s.setVoiceState);
  const setVoiceStopHandler = useModalsStore((s) => s.setVoiceStopHandler);

  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;

  // Mirror FSM status into the modals store for the orb / FAB.
  useEffect(() => {
    setVoiceState(ctx.status);
  }, [ctx.status, setVoiceState]);

  // Speech recognition events → events.
  if (useSpeechRecognitionEvent) {
    useSpeechRecognitionEvent('result', (event: any) => {
      dispatch({
        type: 'SESSION_TRANSCRIPT',
        transcript: event.results[0]?.transcript || '',
      });
    });
    useSpeechRecognitionEvent('end', () => {
      // With `continuous: true` this should only fire on explicit stop or an
      // unexpected engine end. Either way, route to STOP so the user can
      // review/resume.
      if (ctxRef.current.status === 'listening') {
        dispatch({ type: 'STOP' });
      }
    });
    useSpeechRecognitionEvent('error', (event: any) => {
      dispatch({ type: 'FAIL', message: event?.error || 'Speech error' });
    });
  }

  // Side-effect on entering 'listening': start the mic.
  useEffect(() => {
    if (ctx.status !== 'listening') return;
    let cancelled = false;

    if (isMockMode) {
      const mock =
        MOCK_TRANSCRIPTS[Math.floor(Math.random() * MOCK_TRANSCRIPTS.length)];
      let cur = '';
      const handles: ReturnType<typeof setTimeout>[] = [];
      for (let i = 0; i < mock.length; i++) {
        handles.push(
          setTimeout(() => {
            if (cancelled) return;
            cur += mock[i];
            dispatch({ type: 'SESSION_TRANSCRIPT', transcript: cur });
          }, i * 50)
        );
      }
      // No auto-STOP in mock mode — user controls stop, matching the real flow.
      return () => {
        cancelled = true;
        handles.forEach(clearTimeout);
      };
    }

    (async () => {
      try {
        const r = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (cancelled) return;
        if (!r.granted) {
          dispatch({
            type: 'FAIL',
            message: 'Microphone access is off — enable it in settings.',
          });
          return;
        }
        ExpoSpeechRecognitionModule.start({
          lang: voiceLocale,
          interimResults: true,
          continuous: true,
          volumeChangeEventOptions: { enabled: true, intervalMillis: 100 },
        });
      } catch {
        if (cancelled) return;
        dispatch({
          type: 'FAIL',
          message: "Couldn't start the mic — try again.",
        });
      }
    })();
    return () => {
      cancelled = true;
      // Ensure recognizer is stopped if we leave listening for any reason
      // (modal close, error, manual stop). Idempotent.
      if (!isMockMode && ExpoSpeechRecognitionModule) {
        try {
          ExpoSpeechRecognitionModule.stop();
        } catch {}
      }
    };
  }, [ctx.status, voiceLocale]);

  // Side-effect on entering 'processing': run transcription.
  useEffect(() => {
    if (ctx.status !== 'processing') return;
    let cancelled = false;
    (async () => {
      try {
        const items = (await transcribe(ctx.transcript)) as {
          categoryName: string;
          type: 'expense' | 'income';
          amount: number;
          currency: string | null;
        }[];
        if (cancelled) return;
        const normalized: ParsedItem[] = items.map((it, i) => ({
          id: `${Date.now()}-${i}`,
          categoryName: it.categoryName,
          type: it.type,
          amount: Math.abs(it.amount),
          currency: (it.currency ?? defaultCurrency).toLowerCase(),
        }));
        dispatch({ type: 'RESULT', items: normalized });
      } catch (e: any) {
        if (cancelled) return;
        dispatch({ type: 'FAIL', message: e?.message ?? 'Could not parse' });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ctx.status]);

  // FAB primary action varies by state:
  //   listening  → STOP (review)
  //   reviewing  → RESUME (record more)
  // Other states: no-op (FAB stays inert).
  const primary = useCallback(() => {
    const s = ctxRef.current.status;
    if (s === 'listening') {
      if (!isMockMode && ExpoSpeechRecognitionModule) {
        try {
          ExpoSpeechRecognitionModule.stop();
        } catch {}
      }
      dispatch({ type: 'STOP' });
    } else if (s === 'reviewing') {
      dispatch({ type: 'RESUME' });
    }
  }, []);

  useEffect(() => {
    setVoiceStopHandler(primary);
    return () => setVoiceStopHandler(null);
  }, [primary, setVoiceStopHandler]);

  // Modal open/close drives START / RESET.
  useEffect(() => {
    dispatch({ type: open ? 'START' : 'RESET' });
  }, [open]);

  return { ctx, dispatch };
}
