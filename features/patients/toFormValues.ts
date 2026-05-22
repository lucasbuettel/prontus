import type { PatientFormInput } from "./schemas";
import type { Patient } from "@/types/patient";
import { formatCpf } from "@/lib/format/cpf";
import { formatPhoneBr } from "@/lib/format/phone";

export function patientToFormValues(patient: Patient): PatientFormInput {
  return {
    fullName: patient.full_name,
    birthDate: patient.birth_date ?? "",
    sex: patient.sex ?? "",
    cpf: patient.cpf ? formatCpf(patient.cpf) : "",
    phone: patient.phone ? formatPhoneBr(patient.phone) : "",
    primaryCid: patient.primary_cid ?? "",
    notes: patient.notes ?? "",
  };
}
