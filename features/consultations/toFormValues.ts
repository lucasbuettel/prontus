import type { Consultation } from "@/types/consultation";
import type { PrescriptionItem } from "@/types/prescription";
import type { ConsultationFormInput, PrescriptionItemField } from "./schemas";

export const EMPTY_PRESCRIPTION_ITEM: PrescriptionItemField = {
  drugName: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
};

export const EMPTY_CONSULTATION_FORM: ConsultationFormInput = {
  continuousMeds: "",
  physicalExam: "",
  conduct: "",
  complementaryExams: "",
  hda: "",
  hpp: "",
  familyHistory: "",
  psychosocial: "",
  prescriptionItems: [],
};

export function consultationToFormValues(
  c: Consultation,
  items: PrescriptionItem[] = [],
): ConsultationFormInput {
  return {
    continuousMeds: c.continuous_meds ?? "",
    physicalExam: c.physical_exam ?? "",
    conduct: c.conduct ?? "",
    complementaryExams: c.complementary_exams ?? "",
    hda: c.hda ?? "",
    hpp: c.hpp ?? "",
    familyHistory: c.family_history ?? "",
    psychosocial: c.psychosocial ?? "",
    prescriptionItems: items.map(prescriptionItemToField),
  };
}

export function prescriptionItemToField(
  item: PrescriptionItem,
): PrescriptionItemField {
  return {
    id: item.id,
    drugName: item.drug_name,
    dosage: item.dosage ?? "",
    frequency: item.frequency ?? "",
    duration: item.duration ?? "",
    instructions: item.instructions ?? "",
  };
}

/**
 * Mapeia um item de prescrição existente para um campo de formulário SEM id,
 * indicando que ele deve ser inserido como item novo do atendimento corrente
 * (preservando o original no atendimento anterior).
 */
export function prescriptionItemToNewField(
  item: PrescriptionItem,
): PrescriptionItemField {
  return {
    drugName: item.drug_name,
    dosage: item.dosage ?? "",
    frequency: item.frequency ?? "",
    duration: item.duration ?? "",
    instructions: item.instructions ?? "",
  };
}

/**
 * Pre-popula valores comuns + prescrição do último atendimento.
 * - Campos clínicos: continuous_meds, physical_exam, conduct, complementary_exams
 * - Prescrição: copia os itens do último atendimento como NOVOS (sem id),
 *   pra o médico decidir o que mantém antes de salvar. O original fica
 *   preservado no atendimento anterior.
 * - Anamnese fica vazia (só existe em FIRST, que não tem "anterior").
 */
export function defaultsFromLastConsultation(
  last: Consultation | null,
  lastItems: PrescriptionItem[] = [],
): Partial<ConsultationFormInput> {
  if (!last) return {};
  return {
    continuousMeds: last.continuous_meds ?? "",
    physicalExam: last.physical_exam ?? "",
    conduct: last.conduct ?? "",
    complementaryExams: last.complementary_exams ?? "",
    prescriptionItems: lastItems.map(prescriptionItemToNewField),
  };
}
