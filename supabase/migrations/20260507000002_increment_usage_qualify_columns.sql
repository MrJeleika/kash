-- Fix ambiguous column reference: RETURNS TABLE OUT params share names
-- with the underlying columns, so the UPDATE's right-hand side must be
-- table-qualified.

create or replace function public.increment_usage(p_user_id uuid)
returns table (calls_this_month int, monthly_limit int, allowed boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_month date := date_trunc('month', now())::date;
  v_calls int;
  v_limit int;
begin
  insert into public.profiles (id)
  values (p_user_id)
  on conflict (id) do nothing;

  insert into public.usage (user_id, month)
  values (p_user_id, v_month)
  on conflict (user_id, month) do nothing;

  select u.calls_this_month, u.monthly_limit
    into v_calls, v_limit
    from public.usage u
    where u.user_id = p_user_id and u.month = v_month
    for update;

  if v_calls >= v_limit then
    return query select v_calls, v_limit, false;
  else
    update public.usage as u
      set calls_this_month = u.calls_this_month + 1
      where u.user_id = p_user_id and u.month = v_month;
    return query select v_calls + 1, v_limit, true;
  end if;
end;
$$;

revoke all on function public.increment_usage(uuid) from public, anon, authenticated;
grant execute on function public.increment_usage(uuid) to service_role;
