-- ============================================================================
-- 0004_init_prescriptions.sql
-- Cria public.prescription_items — cada linha é UM medicamento prescrito,
-- vinculado a uma consulta. Diferente das outras entidades, DELETE é permitido.
-- ============================================================================

create table if not exists public.prescription_items (
  id              uuid primary key default gen_random_uuid(),
  consultation_id uuid not null references public.consultations(id) on delete cascade,
  patient_id      uuid not null references public.patients(id) on delete restrict,
  drug_name       text not null,
  dosage          text,
  frequency       text,
  duration        text,
  instructions    text,
  position        integer not null default 0,
  created_by      uuid not null references public.profiles(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists prescription_items_consultation_idx
  on public.prescription_items (consultation_id, position, created_at);

create index if not exists prescription_items_patient_idx
  on public.prescription_items (patient_id, created_at desc);

drop trigger if exists set_prescription_items_updated_at on public.prescription_items;
create trigger set_prescription_items_updated_at
  before update on public.prescription_items
  for each row execute function public.set_updated_at();

alter table public.prescription_items enable row level security;

drop policy if exists prescription_items_select_approved on public.prescription_items;
drop policy if exists prescription_items_insert_approved on public.prescription_items;
drop policy if exists prescription_items_update_approved on public.prescription_items;
drop policy if exists prescription_items_delete_approved on public.prescription_items;

create policy prescription_items_select_approved
  on public.prescription_items
  for select
  to authenticated
  using (public.is_approved());

create policy prescription_items_insert_approved
  on public.prescription_items
  for insert
  to authenticated
  with check (public.is_approved() and created_by = auth.uid());

create policy prescription_items_update_approved
  on public.prescription_items
  for update
  to authenticated
  using (public.is_approved())
  with check (public.is_approved());

-- DELETE permitido pra qualquer APPROVED (diferente de patients/consultations).
create policy prescription_items_delete_approved
  on public.prescription_items
  for delete
  to authenticated
  using (public.is_approved());
