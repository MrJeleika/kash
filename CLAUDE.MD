# Kash — AI Budget Tracker

## Project Overview
Kash is an AI-powered mobile budget tracker. Users log expenses via voice, by photographing receipts, or manually — AI extracts the data automatically. The backend handles OpenAI proxying and per-user usage metering. Currency exchange rates are fetched directly from a public CDN by the mobile app.

---

## Monorepo Structure

```
kash/
├── apps/
│   ├── budget-tracker/     # Expo React Native app
│   └── budget-backend/     # Hono backend on Cloudflare Workers
├── packages/
│   └── utils/              # Shared utilities, color config, formatters
├── supabase/
│   └── migrations/         # SQL migrations (CLI: `supabase`)
├── yarn.lock
└── CLAUDE.MD
```

Package manager: **Yarn 4.13** (Berry, `nodeLinker: node-modules`). Workspaces: `apps/*`, `packages/*`.

---

## Apps

### 1. `apps/budget-tracker` — Expo App

**Stack:**
- [Expo](https://expo.dev) (SDK 54+) with Expo Router (file-based routing, typed routes)
- [NativeWind v4](https://www.nativewind.dev) — Tailwind CSS v3 for React Native (**use Tailwind v3, not v4**)
- [Supabase JS client](https://supabase.com/docs/reference/javascript) with AsyncStorage adapter for auth session persistence
- [TanStack Query](https://tanstack.com/query) — for server-fetched data (rates, AI calls)
- [Zustand](https://zustand-demo.pmnd.rs) — local-first source-of-truth for transactions/categories with sync metadata
- [expo-auth-session](https://docs.expo.dev/versions/latest/sdk/auth-session/) + [expo-web-browser](https://docs.expo.dev/versions/latest/sdk/webbrowser/) — OAuth flows
- [expo-speech-recognition](https://docs.expo.dev/versions/latest/sdk/speech-recognition/) — voice input
- [expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) + expo-image-manipulator — receipt OCR capture
- [react-native-svg](https://github.com/software-mansion/react-native-svg) — Insights charts (hand-rolled)
- [@react-native-community/netinfo](https://github.com/react-native-netinfo/react-native-netinfo) — online detection for the sync worker

**Color palette (Digital Industrialism theme):**
Defined in `packages/utils/colors.config.js` and consumed via Tailwind.
- `background` — sandy/khaki main background (`#C2B9A7`)
- `surface` / `surface-raised` — card/panel backgrounds
- `border` — subtle borders
- `text` / `text-muted` — primary and muted text
- `accent` / `accent-hover` — red CTA color (`#CC2200`)

**Key screens (`app/`):**
- `index.tsx` — Auth screen (Google OAuth via Supabase)
- `home.tsx` — Dashboard: monthly spending, category quick-pills, recent transactions
- `history.tsx` — Full transaction history with search + category filter
- `insights.tsx` — Analytics: totals, category donut, daily trend, top merchants
- `settings.tsx` — App settings, sign out, delete local data

**Auth flow:**
- Supabase client is in `lib/supabase.ts` (AsyncStorage + `autoRefreshToken: true` + `persistSession: true`)
- Google OAuth uses `supabase.auth.signInWithOAuth` + `WebBrowser.openAuthSessionAsync`
- Redirect URI uses `makeRedirectUri({ scheme: 'kash' })`
- The `useSession` hook + `AuthGate` in `_layout.tsx` ensure cached sessions skip the login screen even on cold start / offline. Token refresh failures do not sign the user out.

**Local-first sync (push-only v1):**
- Source-of-truth = Zustand stores persisted to AsyncStorage
- Every transaction/category carries `updatedAt`, `syncedAt`, optional `deletedAt`
- `lib/sync.ts` upserts dirty rows to Supabase; `hooks/useSyncWorker.ts` flushes on cold start, foreground return, network reconnect, and 1.5s after every local mutation
- Pull-side merge is deferred to a future milestone (single-device users see no difference)

**Floating action buttons:**
- `+` (red) — manual quick-add sheet
- `MIC` — voice recording → backend `/voice-input` → parsed transactions
- `PHOTO` — camera/gallery → backend `/receipt` → prefills the manual-entry sheet for review

**Env variables (prefix `EXPO_PUBLIC_`):**
```
EXPO_PUBLIC_API_URL
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY
EXPO_PUBLIC_ENVIRONMENT
EXPO_PUBLIC_APP_NAME
```

**Notes:**
- Do NOT store receipt photos in Supabase Storage — only extracted data is saved.
- Run locally: `yarn workspace budget-tracker start`

---

### 2. `apps/budget-backend` — Backend API

Hono on Cloudflare Workers. Handles AI proxying (OpenAI) and per-user monthly usage metering. **Currency rates are NOT served from here** — the mobile app fetches them directly from `cdn.jsdelivr.net/npm/@fawazahmed0/currency-api`.

**Env variables (Wrangler secrets):**
```
OPENAI_API_KEY
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

**Middleware order on AI routes:** IP rate-limit (DoS shield) → `requireAuth` (Supabase JWT) → `meterUsage` (per-user monthly RPC).

**API Routes:**

| Method | Path           | Description                                                |
|--------|----------------|------------------------------------------------------------|
| GET    | `/`            | Health check                                               |
| POST   | `/voice-input` | Transcript + categories → GPT-4o-mini → parsed transactions |
| POST   | `/receipt`     | Base64 image + categories → GPT-4o-mini Vision → parsed tx |

Run locally: `yarn workspace budget-backend dev`

---

## Shared Package (`packages/utils`)

- `colors.config.js` — central color palette consumed by Tailwind + runtime code
- `colors.utils.ts` — `reduceSaturation`
- `text.utils.ts` — `formatNumberWithSpaces`
- `utils.ts` — `cn`, `generateUuid`
- `animations.utils.ts` + `animated-text.tsx` — Reanimated text helpers
- Referenced as `@MrJeleika/utils` in app dependencies

---

## Database (Supabase)

Migrations live under `supabase/migrations/`. RLS is enabled on every table; users only see their own rows. Apply with `supabase db push` (after `supabase link`) or via Studio. Regenerate `types/database.types.ts` with `yarn db:types`.

### Tables

**`profiles`** — extended user data (auto-inserted via `handle_new_user` trigger on `auth.users`)
```sql
id          uuid primary key references auth.users
full_name   text
currency    text not null default 'USD'
created_at  timestamptz default now()
updated_at  timestamptz default now()
```

**`categories`** — user-owned (default set seeded on signup)
```sql
id          uuid primary key default gen_random_uuid()
user_id     uuid references profiles(id) on delete cascade
name        text not null
color       text not null
icon        text not null
type        text check (type in ('income','expense'))
created_at  timestamptz default now()
updated_at  timestamptz default now()
unique (user_id, name)
```

**`transactions`** — all entries
```sql
id                       uuid primary key default gen_random_uuid()
user_id                  uuid references profiles(id) on delete cascade
amount                   numeric(14, 2)
currency                 text
amount_in_base_currency  numeric(14, 2)
base_currency            text
category_name            text
merchant                 text
note                     text
type                     text check (type in ('income','expense'))
input_method             text default 'manual' check (input_method in ('manual','voice','photo'))
date                     date
created_at               timestamptz default now()
updated_at               timestamptz default now()
```

**`usage`** — per-user monthly AI quota (writes via service role only)
```sql
user_id           uuid references profiles(id)
month             date
calls_this_month  int default 0
monthly_limit     int default 10
updated_at        timestamptz default now()
primary key (user_id, month)
```

Plus the `increment_usage(uuid)` SQL function — atomic upsert + check, called from the backend.

---

## Categories (default seed)
`Uncategorized`, `Food`, `Groceries`, `Shopping`, `Entertainment`, `Sport`, `Health`, `Transport`, `Housing`, `Education`, `Travel`, `Subscriptions`, `Salary` (income), `Other` (income)

---

## Development Notes

- Package manager: **Yarn 4.13.0** with workspaces
- Run mobile: `yarn workspace budget-tracker start`
- Run backend: `yarn workspace budget-backend dev`
- Supabase local dev: `supabase start` (Docker)
- Free tier AI call limit per user: **10 calls/month** (enforced via `increment_usage` RPC)
- Multi-currency: user picks a primary currency; transactions stored in original + base-currency amounts. Conversion done client-side using cached jsdelivr CDN rates (24h staleTime).
