export interface PatientComplementaryExam {
  id: string;
  patient_id: string;
  exam_date: string | null;
  exam_name: string;
  result: string | null;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}
