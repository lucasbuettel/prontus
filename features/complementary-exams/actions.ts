"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  complementaryExamFormSchema,
  type ComplementaryExamFormInput,
} from "./schemas";

export type ExamActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export type DeleteResult = { ok: true } | { ok: false; error: string };

function fieldErrorsFromZod(
  parsed: ReturnType<typeof complementaryExamFormSchema.safeParse>,
): Record<string, string> {
  if (parsed.success) return {};
  const flat = parsed.error.flatten();
  const result: Record<string, string> = {};
  for (const [key, msgs] of Object.entries(flat.fieldErrors)) {
    if (msgs && msgs[0]) result[key] = msgs[0];
  }
  return result;
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function mapFormToRow(input: ComplementaryExamFormInput) {
  return {
    exam_date: emptyToNull(input.examDate),
    exam_name: input.examName.trim(),
    result: emptyToNull(input.result),
    notes: emptyToNull(input.notes),
  };
}

function withErrorDetail(base: string, message: string | undefined): string {
  return message ? `${base} (${message})` : base;
}

export async function createComplementaryExam(
  patientId: string,
  input: ComplementaryExamFormInput,
): Promise<ExamActionResult> {
  const parsed = complementaryExamFormSchema.safeParse(input);
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
    .from("patient_complementary_exams")
    .insert({
      patient_id: patientId,
      created_by: user.id,
      ...mapFormToRow(parsed.data),
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !data) {
    console.error("[exams/create] error:", error?.message);
    return {
      ok: false,
      error: withErrorDetail(
        "Não foi possível adicionar o exame.",
        error?.message,
      ),
    };
  }

  revalidatePath(`/patients/${patientId}/exams`);
  return { ok: true, id: data.id };
}

export async function updateComplementaryExam(
  patientId: string,
  examId: string,
  input: ComplementaryExamFormInput,
): Promise<ExamActionResult> {
  const parsed = complementaryExamFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Dados inválidos.",
      fieldErrors: fieldErrorsFromZod(parsed),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("patient_complementary_exams")
    .update(mapFormToRow(parsed.data))
    .eq("id", examId);

  if (error) {
    console.error("[exams/update] error:", error.message);
    return {
      ok: false,
      error: withErrorDetail(
        "Não foi possível atualizar o exame.",
        error.message,
      ),
    };
  }

  revalidatePath(`/patients/${patientId}/exams`);
  return { ok: true, id: examId };
}

export async function deleteComplementaryExam(
  patientId: string,
  examId: string,
): Promise<DeleteResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("patient_complementary_exams")
    .delete()
    .eq("id", examId);

  if (error) {
    console.error("[exams/delete] error:", error.message);
    return {
      ok: false,
      error: withErrorDetail(
        "Não foi possível remover o exame.",
        error.message,
      ),
    };
  }

  revalidatePath(`/patients/${patientId}/exams`);
  return { ok: true };
}
