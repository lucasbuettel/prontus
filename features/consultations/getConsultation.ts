import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Consultation } from "@/types/consultation";

export async function getConsultation(
  id: string,
): Promise<Consultation | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .eq("id", id)
    .maybeSingle<Consultation>();

  if (error) {
    console.error("[consultations/get] error:", error.message);
    return null;
  }
  return data;
}
