import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { PatientComplementaryExam } from "@/types/complementary_exam";

export async function getPatientComplementaryExams(
  patientId: string,
): Promise<PatientComplementaryExam[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("patient_complementary_exams")
    .select("*")
    .eq("patient_id", patientId)
    .order("exam_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .returns<PatientComplementaryExam[]>();

  if (error) {
    console.error("[exams/getByPatient] error:", error.message);
    return [];
  }
  return data ?? [];
}
