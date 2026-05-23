-- ============================================================================
-- 0006_init_complementary_exams.sql
-- Histórico de exames complementares do paciente (independente do atendimento).
-- DELETE permitido — médico pode corrigir/remover linhas erradas.
-- ============================================================================

create table if not exists public.patient_complementary_exams (
  id          uuid primary key default gen_random_uuid(),
  patient_id  uuid not null references public.patients(id) on delete restrict,
  exam_date   date,
  exam_name   text not null,
  result      text,
  notes       text,
  created_by  uuid not null references public.profiles(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists patient_complementary_exams_patient_idx
  on public.patient_complementary_exams (patient_id, exam_date desc, created_at desc);

drop trigger if exists set_patient_complementary_exams_updated_at
  on public.patient_complementary_exams;
create trigger set_patient_complementary_exams_updated_at
  before update on public.patient_complementary_exams
  for each row execute function public.set_updated_at();

alter table public.patient_complementary_exams enable row level security;

drop policy if exists pce_select_approved on public.patient_complementary_exams;
drop policy if exists pce_insert_approved on public.patient_complementary_exams;
drop policy if exists pce_update_approved on public.patient_complementary_exams;
drop policy if exists pce_delete_approved on public.patient_complementary_exams;

create policy pce_select_approved
  on public.patient_complementary_exams
  for select
  to authenticated
  using (public.is_approved());

create policy pce_insert_approved
  on public.patient_complementary_exams
  for insert
  to authenticated
  with check (public.is_approved() and created_by = auth.uid());

create policy pce_update_approved
  on public.patient_complementary_exams
  for update
  to authenticated
  using (public.is_approved())
  with check (public.is_approved());

create policy pce_delete_approved
  on public.patient_complementary_exams
  for delete
  to authenticated
  using (public.is_approved());
