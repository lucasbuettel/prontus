export const CONSULTATION_KINDS = ["FIRST", "RETURN"] as const;
export type ConsultationKind = (typeof CONSULTATION_KINDS)[number];

export interface Consultation {
  id: string;
  patient_id: string;
  kind: ConsultationKind;
  subjective: string | null;
  objective: string | null;
  assessment: string | null;
  plan: string | null;
  hda: string | null;
  hpp: string | null;
  continuous_meds: string | null;
  family_history: string | null;
  psychosocial: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}
