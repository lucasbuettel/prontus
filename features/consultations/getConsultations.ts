import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Consultation } from "@/types/consultation";

export async function getConsultationsByPatient(
  patientId: string,
): Promise<Consultation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false })
    .returns<Consultation[]>();

  if (error) {
    console.error("[consultations/getByPatient] error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getFirstConsultation(
  patientId: string,
): Promise<Consultation | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .eq("patient_id", patientId)
    .eq("kind", "FIRST")
    .maybeSingle<Consultation>();

  if (error) {
    console.error("[consultations/getFirst] error:", error.message);
    return null;
  }
  return data;
}

export async function getLatestConsultation(
  patientId: string,
): Promise<Consultation | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<Consultation>();

  if (error) {
    console.error("[consultations/getLatest] error:", error.message);
    return null;
  }
  return data;
}
