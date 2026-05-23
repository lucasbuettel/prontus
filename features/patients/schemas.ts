import { z } from "zod";
import { PATIENT_SEXES } from "@/types/patient";
import { isValidCpf } from "@/lib/format/cpf";
import { isValidMobilePhoneBr } from "@/lib/format/phone";

export const patientFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Informe o nome completo")
    .max(160, "Nome muito longo"),
  recordNumber: z
    .string()
    .trim()
    .min(1, "Informe o número do prontuário")
    .max(40, "Prontuário muito longo"),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data de nascimento"),
  sex: z.enum(PATIENT_SEXES, { message: "Selecione o sexo" }),
  cpf: z
    .string()
    .refine((v) => v === "" || isValidCpf(v), "CPF inválido"),
  phone: z
    .string()
    .refine(
      (v) => v === "" || isValidMobilePhoneBr(v),
      "Informe um celular válido com DDD (ex: (11) 91234-5678)",
    ),
  primaryCid: z.string().trim().max(20),
  notes: z.string().trim().max(2000, "Anotação muito longa"),
});

export type PatientFormInput = z.infer<typeof patientFormSchema>;

export const patientIdSchema = z.object({
  id: z.string().uuid("ID inválido"),
});
export type PatientIdInput = z.infer<typeof patientIdSchema>;
