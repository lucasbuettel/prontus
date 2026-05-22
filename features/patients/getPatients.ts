import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Patient } from "@/types/patient";

export interface GetPatientsParams {
  q?: string;
}

export async function getPatients({
  q,
}: GetPatientsParams = {}): Promise<Patient[]> {
  const supabase = await createClient();
  const base = supabase.from("patients").select("*");
  const trimmed = q?.trim();
  const filtered = trimmed ? base.ilike("full_name", `%${trimmed}%`) : base;

  const { data, error } = await filtered
    .order("created_at", { ascending: false })
    .returns<Patient[]>();

  if (error) {
    console.error("[patients/getPatients] error:", error.message);
    return [];
  }
  return data ?? [];
}
