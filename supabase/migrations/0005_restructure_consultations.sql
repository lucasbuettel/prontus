-- ============================================================================
-- 0005_restructure_consultations.sql
-- Remove SOAP (subjective/objective/assessment/plan).
-- Adiciona physical_exam, conduct, complementary_exams.
-- continuous_meds passa a ser usado em TODOS os atendimentos (lógica no app).
-- ============================================================================

alter table public.consultations
  drop column if exists subjective,
  drop column if exists objective,
  drop column if exists assessment,
  drop column if exists plan;

alter table public.consultations
  add column if not exists physical_exam      text,
  add column if not exists conduct            text,
  add column if not exists complementary_exams text;
