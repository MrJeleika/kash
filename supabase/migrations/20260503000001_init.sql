-- Kash initial schema: profiles, categories, transactions, usage
-- Offline-first sync uses updated_at + last-write-wins.

create extension if not exists "pgcrypto";

-- ---------- profiles ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  currency text not null default 'USD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------- categories ----------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  color text not null,
  icon text not null,
  type text not null check (type in ('income', 'expense')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

create index categories_user_id_idx on public.categories (user_id);

alter table public.categories enable row level security;

create policy "categories: rw own"
  on public.categories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------- transactions ----------
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(14, 2) not null,
  currency text not null,
  amount_in_base_currency numeric(14, 2) not null,
  base_currency text not null,
  category_name text not null,
  merchant text,
  note text,
  type text not null check (type in ('income', 'expense')),
  input_method text not null default 'manual' check (input_method in ('manual', 'voice', 'photo')),
  date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index transactions_user_id_date_idx on public.transactions (user_id, date desc);
create index transactions_user_id_updated_at_idx on public.transactions (user_id, updated_at desc);

alter table public.transactions enable row level security;

create policy "transactions: rw own"
  on public.transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------- usage (free-tier metering) ----------
create table public.usage (
  user_id uuid not null references public.profiles(id) on delete cascade,
  month date not null,
  calls_this_month int not null default 0,
  monthly_limit int not null default 10,
  updated_at timestamptz not null default now(),
  primary key (user_id, month)
);

alter table public.usage enable row level security;

-- Read-only for the user; writes happen server-side with the service role key
create policy "usage: read own"
  on public.usage for select
  using (auth.uid() = user_id);

-- ---------- updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger categories_set_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

create trigger transactions_set_updated_at before update on public.transactions
  for each row execute function public.set_updated_at();

create trigger usage_set_updated_at before update on public.usage
  for each row execute function public.set_updated_at();

-- ---------- new user bootstrap ----------
-- On every new auth.users row, create a profiles row and seed default categories.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'));

  insert into public.categories (user_id, name, color, icon, type) values
    (new.id, 'Uncategorized', '#333333', 'CircleSlash', 'expense'),
    (new.id, 'Food',          '#CC2200', 'UtensilsCrossed', 'expense'),
    (new.id, 'Groceries',     '#E07820', 'ShoppingCart', 'expense'),
    (new.id, 'Shopping',      '#6B3FA0', 'ShoppingBag', 'expense'),
    (new.id, 'Entertainment', '#D4A017', 'Music', 'expense'),
    (new.id, 'Sport',         '#3A7D44', 'Dumbbell', 'expense'),
    (new.id, 'Health',        '#3A7DB0', 'HeartPulse', 'expense'),
    (new.id, 'Transport',     '#6DA832', 'Car', 'expense'),
    (new.id, 'Housing',       '#2A5DA8', 'House', 'expense'),
    (new.id, 'Education',     '#FF5733', 'GraduationCap', 'expense'),
    (new.id, 'Travel',        '#FF5733', 'Plane', 'expense'),
    (new.id, 'Subscriptions', '#FF5733', 'Repeat', 'expense'),
    (new.id, 'Salary',        '#3A7D44', 'Banknote', 'income'),
    (new.id, 'Other',         '#7A7469', 'Coins', 'income');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
