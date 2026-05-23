export interface PrescriptionItem {
  id: string;
  consultation_id: string;
  patient_id: string;
  drug_name: string;
  dosage: string | null;
  frequency: string | null;
  duration: string | null;
  instructions: string | null;
  position: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}
