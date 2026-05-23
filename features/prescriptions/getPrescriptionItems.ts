import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { PrescriptionItem } from "@/types/prescription";

export async function getPrescriptionItemsByConsultation(
  consultationId: string,
): Promise<PrescriptionItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prescription_items")
    .select("*")
    .eq("consultation_id", consultationId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true })
    .returns<PrescriptionItem[]>();

  if (error) {
    console.error("[prescriptions/getByConsultation] error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getPrescriptionItem(
  id: string,
): Promise<PrescriptionItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prescription_items")
    .select("*")
    .eq("id", id)
    .maybeSingle<PrescriptionItem>();

  if (error) {
    console.error("[prescriptions/get] error:", error.message);
    return null;
  }
  return data;
}
