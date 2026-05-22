export const PATIENT_SEXES = ["M", "F", "OUTRO"] as const;
export type PatientSex = (typeof PATIENT_SEXES)[number];

export interface Patient {
  id: string;
  full_name: string;
  birth_date: string | null;
  sex: PatientSex | null;
  cpf: string | null;
  phone: string | null;
  primary_cid: string | null;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}
