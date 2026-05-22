"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  consultationFormSchema,
  type ConsultationFormInput,
} from "./schemas";
import type { ConsultationKind } from "@/types/consultation";

export type ConsultationActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function fieldErrorsFromZod(
  parsed: ReturnType<typeof consultationFormSchema.safeParse>,
): Record<string, string> {
  if (parsed.success) return {};
  const flat = parsed.error.flatten();
  const result: Record<string, string> = {};
  for (const [key, msgs] of Object.entries(flat.fieldErrors)) {
    if (msgs && msgs[0]) result[key] = msgs[0];
  }
  return result;
}

function emptyToNull(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function mapSoapToRow(input: ConsultationFormInput) {
  return {
    subjective: emptyToNull(input.subjective),
    objective: emptyToNull(input.objective),
    assessment: emptyToNull(input.assessment),
    plan: emptyToNull(input.plan),
  };
}

function mapAnamnesisToRow(input: ConsultationFormInput) {
  return {
    hda: emptyToNull(input.hda),
    hpp: emptyToNull(input.hpp),
    continuous_meds: emptyToNull(input.continuousMeds),
    family_history: emptyToNull(input.familyHistory),
    psychosocial: emptyToNull(input.psychosocial),
  };
}

export async function createConsultation(
  patientId: string,
  input: ConsultationFormInput,
): Promise<ConsultationActionResult> {
  const parsed = consultationFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Dados inválidos.",
      fieldErrors: fieldErrorsFromZod(parsed),
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sessão expirada." };

  // Decide kind: se já existe FIRST do paciente, esta é RETURN.
  const { count } = await supabase
    .from("consultations")
    .select("id", { count: "exact", head: true })
    .eq("patient_id", patientId)
    .eq("kind", "FIRST");

  const kind: ConsultationKind = (count ?? 0) > 0 ? "RETURN" : "FIRST";

  const row = {
    patient_id: patientId,
    kind,
    created_by: user.id,
    ...mapSoapToRow(parsed.data),
    // Campos de anamnese só ficam em FIRST.
    ...(kind === "FIRST"
      ? mapAnamnesisToRow(parsed.data)
      : {
          hda: null,
          hpp: null,
          continuous_meds: null,
          family_history: null,
          psychosocial: null,
        }),
  };

  const { data, error } = await supabase
    .from("consultations")
    .insert(row)
    .select("id")
    .single<{ id: string }>();

  if (error || !data) {
    console.error("[consultations/create] error:", error?.message);
    // Race: outro super admin criou FIRST entre o count e o insert.
    if (error?.code === "23505") {
      return {
        ok: false,
        error:
          "Este paciente já tem uma primeira consulta. Recarregue e tente novamente.",
      };
    }
    return { ok: false, error: "Não foi possível criar a consulta." };
  }

  revalidatePath(`/patients/${patientId}`);
  return { ok: true, id: data.id };
}

export async function updateConsultation(
  patientId: string,
  consultationId: string,
  input: ConsultationFormInput,
): Promise<ConsultationActionResult> {
  const parsed = consultationFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Dados inválidos.",
      fieldErrors: fieldErrorsFromZod(parsed),
    };
  }

  const supabase = await createClient();

  // Busca a consulta pra saber o kind (só FIRST aceita anamnese).
  const { data: current, error: fetchError } = await supabase
    .from("consultations")
    .select("kind")
    .eq("id", consultationId)
    .maybeSingle<{ kind: ConsultationKind }>();

  if (fetchError || !current) {
    return { ok: false, error: "Consulta não encontrada." };
  }

  const row = {
    ...mapSoapToRow(parsed.data),
    ...(current.kind === "FIRST"
      ? mapAnamnesisToRow(parsed.data)
      : {}),
  };

  const { error } = await supabase
    .from("consultations")
    .update(row)
    .eq("id", consultationId);

  if (error) {
    console.error("[consultations/update] error:", error.message);
    return { ok: false, error: "Não foi possível atualizar a consulta." };
  }

  revalidatePath(`/patients/${patientId}`);
  revalidatePath(`/patients/${patientId}/consultations/${consultationId}`);
  return { ok: true, id: consultationId };
}
