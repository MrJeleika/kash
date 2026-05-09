export type VoiceStatus =
  | 'idle'
  | 'listening'
  | 'reviewing'
  | 'processing'
  | 'ready'
  | 'empty'
  | 'error';

export type ParsedItem = {
  id: string;
  categoryName: string;
  type: 'expense' | 'income';
  amount: number;
  currency: string;
};

export type VoiceContext = {
  status: VoiceStatus;
  /** Full transcript shown to the user. Equals committedPrefix + current session text. */
  transcript: string;
  /** Saved transcript from prior recording sessions; new speech appends after this. */
  committedPrefix: string;
  parsed: ParsedItem[];
  error: string | null;
};

export type VoiceEvent =
  /** Modal opened — start a fresh session. */
  | { type: 'START' }
  /** Live transcript update from the active recognizer session. */
  | { type: 'SESSION_TRANSCRIPT'; transcript: string }
  /** User tapped stop, or recognizer ended unexpectedly. */
  | { type: 'STOP' }
  /** From reviewing → listening to add more speech. */
  | { type: 'RESUME' }
  /** From reviewing → processing (send to AI). */
  | { type: 'SUBMIT' }
  | { type: 'RESULT'; items: ParsedItem[] }
  | { type: 'FAIL'; message: string }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_ITEM'; id: string; patch: Partial<ParsedItem> }
  | { type: 'RESET' };

export const initialContext: VoiceContext = {
  status: 'idle',
  transcript: '',
  committedPrefix: '',
  parsed: [],
  error: null,
};

const join = (prefix: string, session: string) => {
  if (!prefix) return session;
  if (!session) return prefix;
  return `${prefix} ${session}`;
};

export function voiceReducer(
  ctx: VoiceContext,
  event: VoiceEvent
): VoiceContext {
  if (event.type === 'RESET') return initialContext;

  switch (ctx.status) {
    case 'idle':
      if (event.type === 'START') {
        return { ...initialContext, status: 'listening' };
      }
      if (event.type === 'FAIL') {
        return { ...ctx, status: 'error', error: event.message };
      }
      return ctx;

    case 'listening':
      if (event.type === 'SESSION_TRANSCRIPT') {
        return {
          ...ctx,
          transcript: join(ctx.committedPrefix, event.transcript),
        };
      }
      if (event.type === 'STOP') {
        const final = ctx.transcript.trim();
        if (!final) return { ...ctx, status: 'empty' };
        return {
          ...ctx,
          status: 'reviewing',
          transcript: final,
          committedPrefix: final,
        };
      }
      if (event.type === 'FAIL') {
        return { ...ctx, status: 'error', error: event.message };
      }
      return ctx;

    case 'reviewing':
      if (event.type === 'RESUME') {
        return { ...ctx, status: 'listening' };
      }
      if (event.type === 'SUBMIT') {
        if (!ctx.transcript.trim()) return { ...ctx, status: 'empty' };
        return { ...ctx, status: 'processing' };
      }
      return ctx;

    case 'processing':
      if (event.type === 'RESULT') {
        return event.items.length > 0
          ? { ...ctx, status: 'ready', parsed: event.items }
          : { ...ctx, status: 'empty' };
      }
      if (event.type === 'FAIL') {
        return { ...ctx, status: 'error', error: event.message };
      }
      return ctx;

    case 'ready':
      if (event.type === 'REMOVE_ITEM') {
        const next = ctx.parsed.filter((p) => p.id !== event.id);
        return next.length === 0
          ? { ...ctx, status: 'empty', parsed: [] }
          : { ...ctx, parsed: next };
      }
      if (event.type === 'UPDATE_ITEM') {
        return {
          ...ctx,
          parsed: ctx.parsed.map((p) =>
            p.id === event.id ? { ...p, ...event.patch } : p
          ),
        };
      }
      return ctx;

    case 'empty':
    case 'error':
      // Only RESET escapes (handled above).
      return ctx;
  }
}
