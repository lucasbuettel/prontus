"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  consultationFormSchema,
  type ConsultationFormInput,
  type PrescriptionItemField,
} from "./schemas";
import type { ConsultationKind } from "@/types/consultation";

export type ConsultationActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

type SupabaseServer = Awaited<ReturnType<typeof createClient>>;

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

function mapCommonToRow(input: ConsultationFormInput) {
  return {
    continuous_meds: emptyToNull(input.continuousMeds),
    physical_exam: emptyToNull(input.physicalExam),
    conduct: emptyToNull(input.conduct),
    complementary_exams: emptyToNull(input.complementaryExams),
  };
}

function mapAnamnesisToRow(input: ConsultationFormInput) {
  return {
    hda: emptyToNull(input.hda),
    hpp: emptyToNull(input.hpp),
    family_history: emptyToNull(input.familyHistory),
    psychosocial: emptyToNull(input.psychosocial),
  };
}

function mapPrescriptionItemToRow(item: PrescriptionItemField) {
  return {
    drug_name: item.drugName,
    dosage: emptyToNull(item.dosage),
    frequency: emptyToNull(item.frequency),
    duration: emptyToNull(item.duration),
    instructions: emptyToNull(item.instructions),
  };
}

function withErrorDetail(base: string, message: string | undefined): string {
  return message ? `${base} (${message})` : base;
}

async function syncPrescriptionItems(
  supabase: SupabaseServer,
  patientId: string,
  consultationId: string,
  formItems: PrescriptionItemField[],
  createdBy: string,
): Promise<string | null> {
  const { data: current, error: fetchError } = await supabase
    .from("prescription_items")
    .select("id")
    .eq("consultation_id", consultationId)
    .returns<{ id: string }[]>();

  if (fetchError) {
    return withErrorDetail(
      "Falha ao ler prescrições atuais.",
      fetchError.message,
    );
  }

  const currentIds = new Set((current ?? []).map((c) => c.id));
  const formIds = new Set(
    formItems.map((i) => i.id).filter((id): id is string => Boolean(id)),
  );

  const toDelete = [...currentIds].filter((id) => !formIds.has(id));
  if (toDelete.length > 0) {
    const { error } = await supabase
      .from("prescription_items")
      .delete()
      .in("id", toDelete);
    if (error) {
      return withErrorDetail("Falha ao remover medicamentos.", error.message);
    }
  }

  for (let i = 0; i < formItems.length; i++) {
    const item = formItems[i];
    const row = mapPrescriptionItemToRow(item);
    if (item.id && currentIds.has(item.id)) {
      const { error } = await supabase
        .from("prescription_items")
        .update({ ...row, position: i })
        .eq("id", item.id);
      if (error) {
        return withErrorDetail("Falha ao atualizar medicamento.", error.message);
      }
    } else {
      const { error } = await supabase.from("prescription_items").insert({
        patient_id: patientId,
        consultation_id: consultationId,
        created_by: createdBy,
        position: i,
        ...row,
      });
      if (error) {
        return withErrorDetail("Falha ao adicionar medicamento.", error.message);
      }
    }
  }

  return null;
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
    ...mapCommonToRow(parsed.data),
    ...(kind === "FIRST"
      ? mapAnamnesisToRow(parsed.data)
      : {
          hda: null,
          hpp: null,
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
    if (error?.code === "23505") {
      return {
        ok: false,
        error:
          "Este paciente já tem um Atendimento 1. Recarregue e tente novamente.",
      };
    }
    return {
      ok: false,
      error: withErrorDetail(
        "Não foi possível criar o atendimento.",
        error?.message,
      ),
    };
  }

  if (parsed.data.prescriptionItems.length > 0) {
    const syncError = await syncPrescriptionItems(
      supabase,
      patientId,
      data.id,
      parsed.data.prescriptionItems,
      user.id,
    );
    if (syncError) {
      // Atendimento criado, mas prescrição falhou: comunicar parcialmente.
      revalidatePath(`/patients/${patientId}`);
      return { ok: false, error: syncError };
    }
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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sessão expirada." };

  const { data: current, error: fetchError } = await supabase
    .from("consultations")
    .select("kind")
    .eq("id", consultationId)
    .maybeSingle<{ kind: ConsultationKind }>();

  if (fetchError || !current) {
    return { ok: false, error: "Atendimento não encontrado." };
  }

  const row = {
    ...mapCommonToRow(parsed.data),
    ...(current.kind === "FIRST" ? mapAnamnesisToRow(parsed.data) : {}),
  };

  const { error } = await supabase
    .from("consultations")
    .update(row)
    .eq("id", consultationId);

  if (error) {
    console.error("[consultations/update] error:", error.message);
    return {
      ok: false,
      error: withErrorDetail(
        "Não foi possível atualizar o atendimento.",
        error.message,
      ),
    };
  }

  // Prescrição: só sincroniza se este atendimento for o mais recente do paciente.
  const { data: latest } = await supabase
    .from("consultations")
    .select("id")
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ id: string }>();

  if (latest?.id === consultationId) {
    const syncError = await syncPrescriptionItems(
      supabase,
      patientId,
      consultationId,
      parsed.data.prescriptionItems,
      user.id,
    );
    if (syncError) {
      revalidatePath(`/patients/${patientId}/consultations/${consultationId}`);
      return { ok: false, error: syncError };
    }
  }

  revalidatePath(`/patients/${patientId}`);
  revalidatePath(`/patients/${patientId}/consultations/${consultationId}`);
  return { ok: true, id: consultationId };
}
