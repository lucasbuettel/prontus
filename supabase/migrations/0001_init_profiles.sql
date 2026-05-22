-- ============================================================================
-- 0001_init_profiles.sql
-- Cria a tabela public.profiles, vinculada a auth.users, com RLS habilitada.
-- Roles: SUPERADMIN | DOCTOR. Status: PENDING | APPROVED | REJECTED.
-- Novos usuários entram como DOCTOR/PENDING e precisam ser aprovados.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Tabela profiles
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'DOCTOR'
              check (role in ('SUPERADMIN', 'DOCTOR')),
  status      text not null default 'PENDING'
              check (status in ('PENDING', 'APPROVED', 'REJECTED')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists profiles_status_idx
  on public.profiles (status, created_at desc);

-- ----------------------------------------------------------------------------
-- updated_at automático
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Criação automática de profile quando um auth.users é inserido
-- (cobre cadastro por email/senha e via Google OAuth)
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, status)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    'DOCTOR',
    'PENDING'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Helper para checar SUPERADMIN sem causar recursão de RLS
-- ----------------------------------------------------------------------------
create or replace function public.is_superadmin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'SUPERADMIN'
  );
$$;

-- ----------------------------------------------------------------------------
-- RLS
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- Limpa policies antigas se a migration for re-rodada
drop policy if exists profiles_select_own_or_admin on public.profiles;
drop policy if exists profiles_update_admin_only   on public.profiles;

-- SELECT: usuário lê seu próprio profile; SUPERADMIN lê todos
create policy profiles_select_own_or_admin
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id or public.is_superadmin());

-- UPDATE: apenas SUPERADMIN pode atualizar profiles (aprovar/rejeitar/promover)
create policy profiles_update_admin_only
  on public.profiles
  for update
  to authenticated
  using (public.is_superadmin())
  with check (public.is_superadmin());

-- INSERT e DELETE não recebem policy → bloqueados por RLS.
-- INSERT acontece via trigger (security definer); DELETE só por administrador do DB.

-- ----------------------------------------------------------------------------
-- Como promover seu primeiro SUPERADMIN após cadastrar-se:
--
--   update public.profiles
--     set role = 'SUPERADMIN', status = 'APPROVED'
--     where email = 'seu-email@dominio.com';
--
-- Rode isso no SQL Editor do Supabase logado como o owner do projeto
-- (a UI bypassa RLS automaticamente).
-- ----------------------------------------------------------------------------
