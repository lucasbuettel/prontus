import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Patient } from "@/types/patient";

export async function getPatient(id: string): Promise<Patient | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .maybeSingle<Patient>();

  if (error) {
    console.error("[patients/getPatient] error:", error.message);
    return null;
  }
  return data;
}
