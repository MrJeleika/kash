# Supabase

Schema, migrations, and local-dev setup for Kash.

## Tables

- `profiles` — extended user data (1:1 with `auth.users`)
- `categories` — user-owned expense/income categories (default set seeded on signup)
- `transactions` — all expense/income entries
- `usage` — per-user monthly AI-call quota for backend metering

All tables have RLS enabled. Users can only access their own rows. The `usage` table is read-only for users; the backend writes to it via the service-role key.

## First-time setup

```sh
brew install supabase/tap/supabase            # install CLI
supabase login                                # one-time
supabase link --project-ref <YOUR_PROJECT_REF>
supabase db push                              # apply migrations to remote
yarn db:types                                 # regenerate database.types.ts
```

## Local dev

```sh
supabase start          # spin up local Postgres + studio (Docker required)
supabase db reset       # re-apply all migrations against local
yarn db:types           # regenerate types from local schema
```

## Adding a migration

```sh
supabase migration new <name>
# edit the generated file under supabase/migrations/
supabase db reset       # verify locally
supabase db push        # ship to remote
yarn db:types
```
