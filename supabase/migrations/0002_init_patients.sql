-- ============================================================================
-- 0002_init_patients.sql
-- Cria public.patients com RLS: todos os usuários APPROVED leem e escrevem
-- (modelo "clínica única"). DELETE bloqueado (pacientes não são apagados).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Helper: usuário atual está APPROVED?
-- ----------------------------------------------------------------------------
create or replace function public.is_approved()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and status = 'APPROVED'
  );
$$;

-- ----------------------------------------------------------------------------
-- Tabela patients
-- ----------------------------------------------------------------------------
create table if not exists public.patients (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null,
  birth_date   date,
  sex          text check (sex in ('M', 'F', 'OUTRO')),
  cpf          text,
  phone        text,
  primary_cid  text,
  notes        text,
  created_by   uuid not null references public.profiles(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists patients_full_name_idx
  on public.patients (full_name);

create index if not exists patients_created_at_idx
  on public.patients (created_at desc);

-- ----------------------------------------------------------------------------
-- updated_at automático (reaproveita set_updated_at de 0001)
-- ----------------------------------------------------------------------------
drop trigger if exists set_patients_updated_at on public.patients;
create trigger set_patients_updated_at
  before update on public.patients
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- RLS
-- ----------------------------------------------------------------------------
alter table public.patients enable row level security;

drop policy if exists patients_select_approved on public.patients;
drop policy if exists patients_insert_approved on public.patients;
drop policy if exists patients_update_approved on public.patients;

-- SELECT: qualquer usuário APPROVED lê todos os pacientes.
create policy patients_select_approved
  on public.patients
  for select
  to authenticated
  using (public.is_approved());

-- INSERT: APPROVED, e o created_by precisa ser o próprio usuário.
create policy patients_insert_approved
  on public.patients
  for insert
  to authenticated
  with check (public.is_approved() and created_by = auth.uid());

-- UPDATE: qualquer APPROVED pode editar qualquer paciente (clínica única).
create policy patients_update_approved
  on public.patients
  for update
  to authenticated
  using (public.is_approved())
  with check (public.is_approved());

-- DELETE: sem policy → bloqueado por RLS. Pacientes não são apagados.
