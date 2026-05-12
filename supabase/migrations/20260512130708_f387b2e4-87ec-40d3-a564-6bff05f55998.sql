
create type public.app_plan as enum ('free','premium');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  plan public.app_plan not null default 'free',
  import_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "select own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);

create policy "insert own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

create policy "update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, plan)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    case when lower(new.email) in ('talhab@discreetize.com','talhab@dicreetize.com')
         then 'premium'::public.app_plan
         else 'free'::public.app_plan
    end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.bump_import()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count int;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  update public.profiles
    set import_count = import_count + 1,
        updated_at = now()
    where id = auth.uid()
    returning import_count into new_count;
  return new_count;
end;
$$;

create or replace function public.upgrade_to_premium()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  update public.profiles set plan = 'premium', updated_at = now()
    where id = auth.uid();
end;
$$;
