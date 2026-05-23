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
  const filtered = trimmed
    ? base.or(
        `full_name.ilike.%${trimmed}%,record_number.ilike.%${trimmed}%`,
      )
    : base;

  const { data, error } = await filtered
    .order("full_name", { ascending: true })
    .returns<Patient[]>();

  if (error) {
    console.error("[patients/getPatients] error:", error.message);
    return [];
  }
  return data ?? [];
}
