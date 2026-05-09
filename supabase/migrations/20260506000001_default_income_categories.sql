-- Expand the default income category seed for new users.
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
    (new.id, 'Freelance',     '#4D8B3A', 'Briefcase', 'income'),
    (new.id, 'Investments',   '#2E7D5A', 'TrendingUp', 'income'),
    (new.id, 'Gifts',         '#A87332', 'Gift', 'income'),
    (new.id, 'Other',         '#7A7469', 'Coins', 'income');

  return new;
end;
$$;
