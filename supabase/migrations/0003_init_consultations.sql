-- ============================================================================
-- 0003_init_consultations.sql
-- Cria public.consultations (SOAP). Cada paciente tem no máximo UMA
-- consulta kind='FIRST'; demais são 'RETURN'. RLS: todos APPROVED leem/escrevem.
-- ============================================================================

create table if not exists public.consultations (
  id                  uuid primary key default gen_random_uuid(),
  patient_id          uuid not null references public.patients(id) on delete restrict,
  kind                text not null check (kind in ('FIRST', 'RETURN')),

  -- SOAP (todas as consultas)
  subjective          text,
  objective           text,
  assessment          text,
  plan                text,

  -- Anamnese (apenas primeira consulta — devem ficar null em RETURN)
  hda                 text,
  hpp                 text,
  continuous_meds     text,
  family_history      text,
  psychosocial        text,

  -- Meta
  created_by          uuid not null references public.profiles(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Apenas uma primeira consulta por paciente (regra do produto).
create unique index if not exists consultations_one_first_per_patient
  on public.consultations (patient_id)
  where kind = 'FIRST';

create index if not exists consultations_patient_created_idx
  on public.consultations (patient_id, created_at desc);

drop trigger if exists set_consultations_updated_at on public.consultations;
create trigger set_consultations_updated_at
  before update on public.consultations
  for each row execute function public.set_updated_at();

alter table public.consultations enable row level security;

drop policy if exists consultations_select_approved on public.consultations;
drop policy if exists consultations_insert_approved on public.consultations;
drop policy if exists consultations_update_approved on public.consultations;

create policy consultations_select_approved
  on public.consultations
  for select
  to authenticated
  using (public.is_approved());

create policy consultations_insert_approved
  on public.consultations
  for insert
  to authenticated
  with check (public.is_approved() and created_by = auth.uid());

create policy consultations_update_approved
  on public.consultations
  for update
  to authenticated
  using (public.is_approved())
  with check (public.is_approved());

-- DELETE bloqueado por RLS (consultas não são apagadas).
