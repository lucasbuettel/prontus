export const CONSULTATION_KINDS = ["FIRST", "RETURN"] as const;
export type ConsultationKind = (typeof CONSULTATION_KINDS)[number];

export interface Consultation {
  id: string;
  patient_id: string;
  kind: ConsultationKind;

  // Comum a todos os atendimentos
  continuous_meds: string | null;
  physical_exam: string | null;
  conduct: string | null;
  complementary_exams: string | null;

  // Exclusivo do Atendimento 1 (kind=FIRST)
  hda: string | null;
  hpp: string | null;
  family_history: string | null;
  psychosocial: string | null;

  created_by: string;
  created_at: string;
  updated_at: string;
}
