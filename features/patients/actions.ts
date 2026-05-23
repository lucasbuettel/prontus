"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { patientFormSchema, type PatientFormInput } from "./schemas";
import { unmaskCpf } from "@/lib/format/cpf";
import { unmaskPhone } from "@/lib/format/phone";

export type PatientActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function fieldErrorsFromZod(
  parsed: ReturnType<typeof patientFormSchema.safeParse>,
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

function mapFormToRow(input: ReturnType<typeof patientFormSchema.parse>) {
  return {
    full_name: input.fullName,
    record_number: input.recordNumber.trim(),
    birth_date: input.birthDate,
    sex: input.sex,
    cpf: emptyToNull(unmaskCpf(input.cpf)),
    phone: emptyToNull(unmaskPhone(input.phone)),
    primary_cid: emptyToNull(input.primaryCid),
    notes: emptyToNull(input.notes),
  };
}

function withErrorDetail(base: string, message: string | undefined): string {
  return message ? `${base} (${message})` : base;
}

export async function createPatient(
  input: PatientFormInput,
): Promise<PatientActionResult> {
  const parsed = patientFormSchema.safeParse(input);
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

  const { data, error } = await supabase
    .from("patients")
    .insert({ ...mapFormToRow(parsed.data), created_by: user.id })
    .select("id")
    .single<{ id: string }>();

  if (error || !data) {
    console.error("[patients/createPatient] error:", error?.message);
    if (error?.code === "23505") {
      return {
        ok: false,
        error: "Já existe paciente com esse número de prontuário.",
        fieldErrors: { recordNumber: "Prontuário já cadastrado" },
      };
    }
    return {
      ok: false,
      error: withErrorDetail(
        "Não foi possível criar o paciente.",
        error?.message,
      ),
    };
  }

  revalidatePath("/patients");
  return { ok: true, id: data.id };
}

export async function updatePatient(
  id: string,
  input: PatientFormInput,
): Promise<PatientActionResult> {
  const parsed = patientFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Dados inválidos.",
      fieldErrors: fieldErrorsFromZod(parsed),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("patients")
    .update(mapFormToRow(parsed.data))
    .eq("id", id);

  if (error) {
    console.error("[patients/updatePatient] error:", error.message);
    if (error.code === "23505") {
      return {
        ok: false,
        error: "Já existe paciente com esse número de prontuário.",
        fieldErrors: { recordNumber: "Prontuário já cadastrado" },
      };
    }
    return {
      ok: false,
      error: withErrorDetail(
        "Não foi possível atualizar o paciente.",
        error.message,
      ),
    };
  }

  revalidatePath("/patients");
  revalidatePath(`/patients/${id}`);
  return { ok: true, id };
}
