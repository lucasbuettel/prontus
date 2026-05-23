-- ============================================================================
-- 0007_patient_record_number.sql
-- Adiciona prontuário ao paciente.
-- Nullable no banco (compatível com linhas existentes); required no app via Zod.
-- Unique parcial: garante prontuário único entre os preenchidos, mas permite
-- múltiplos NULL durante migração.
-- ============================================================================

alter table public.patients
  add column if not exists record_number text;

create unique index if not exists patients_record_number_unique
  on public.patients (record_number)
  where record_number is not null;

create index if not exists patients_record_number_idx
  on public.patients (record_number);
