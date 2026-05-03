# Backlog

Items deferred from the redesign + analytics + OCR milestone (May 2026).

## Features

- **Savings goals** — CRUD on goal name/target/currency/date, manual contributions, progress + projected date, multiple concurrent goals with one featured. Mockup design exists ("New Tokyo Studio Apartment" card). Will need a `goals` table + `goal_contributions` table.
- **Per-category budgets** — monthly limits per category with progress bars and over-budget warnings. Spec was in CLAUDE.md but never built. Will need a `budgets` table.
- **Multi-wallet / Cards tab** — multiple accounts (cash, card1, card2…), assign each transaction to a wallet, per-wallet balance. The mockup hints at a CARDS tab; we're skipping it for now and using a single implicit wallet.
- **Recurring transactions** — schedule expense templates that auto-create on a cadence.
- **Auto-save roundups** — round each expense up to the nearest unit and stash the diff into a savings goal.
- **Push notifications** — budget alerts, anomaly detection ("3× your usual coffee spend this week").
- **CSV / PDF export** — currently a TODO label in Settings.
- **Account management** — email change, password reset, full account delete (server-side, not just local).
- **Dark mode** — light Industrialism is the only theme today; the token system in `colors.config.js` is structured to support a dark theme later.
- **Bidirectional sync (pull side)** — currently push-only. For multi-device, we need to pull remote changes since `lastPullAt`, merge by `updated_at` (last-write-wins), and reconcile soft-deletes.
- **Voice screen polish** — extracted-detail cards + chips (CATEGORY/DATE/WALLET/LOCATION) per the mockup. Today the voice flow shows a basic transcript + parsed list.
- **Manual entry full-screen redesign** — convert the bottom-sheet to a full-screen Stack route with merchant + payment source + receipt-attach slot per the mockup. Today we kept the existing fast-entry sheet (with a new merchant field) for v1 since it preserves the keypad UX.

## Engineering

- **Generated Supabase types** — replace `apps/budget-tracker/types/database.types.ts` (currently hand-stubbed) by running `yarn db:types` once the project is `supabase link`-ed.
- **Icon component cleanup** — `components/ui/icon.tsx` doesn't accept `className` / `color` / `size` / `fill` / `strokeWidth` per its current type, but components pass them. Update its `Props` type so TypeScript is clean (currently a long list of pre-existing errors that we ignore).
- **`select-category.tsx` ScrollView ref typing** — pre-existing `RefObject<ScrollView | null>` type error; needs the ref to be typed properly.
- **Test suite** — there are no tests today. Start with utils (`groupTransactionsByDate`, `useInsights` aggregation) and the sync push logic.
- **CI** — no GitHub Actions yet. Add lint + typecheck on PR.
- **`lib/` directory was empty in git** — now contains `supabase.ts`, `queryClient.ts` (didn't end up needing), `sync.ts`, `api.ts`. Verify it ships.
