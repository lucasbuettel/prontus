import type { Consultation } from "@/types/consultation";
import type { ConsultationFormInput } from "./schemas";

export const EMPTY_CONSULTATION_FORM: ConsultationFormInput = {
  subjective: "",
  objective: "",
  assessment: "",
  plan: "",
  hda: "",
  hpp: "",
  continuousMeds: "",
  familyHistory: "",
  psychosocial: "",
};

export function consultationToFormValues(
  c: Consultation,
): ConsultationFormInput {
  return {
    subjective: c.subjective ?? "",
    objective: c.objective ?? "",
    assessment: c.assessment ?? "",
    plan: c.plan ?? "",
    hda: c.hda ?? "",
    hpp: c.hpp ?? "",
    continuousMeds: c.continuous_meds ?? "",
    familyHistory: c.family_history ?? "",
    psychosocial: c.psychosocial ?? "",
  };
}
