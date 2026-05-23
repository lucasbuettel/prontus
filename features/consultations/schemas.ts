import { z } from "zod";

const clinicalText = z.string().trim().max(8000, "Texto muito longo");
const anamnesisText = z.string().trim().max(4000, "Texto muito longo");

export const prescriptionItemFieldSchema = z.object({
  id: z.string().uuid().optional(),
  drugName: z
    .string()
    .trim()
    .min(2, "Informe o nome do medicamento")
    .max(160, "Nome muito longo"),
  dosage: z.string().trim().max(80, "Texto muito longo"),
  frequency: z.string().trim().max(80, "Texto muito longo"),
  duration: z.string().trim().max(80, "Texto muito longo"),
  instructions: z.string().trim().max(500, "Texto muito longo"),
});
export type PrescriptionItemField = z.infer<typeof prescriptionItemFieldSchema>;

export const consultationFormSchema = z.object({
  continuousMeds: clinicalText,
  physicalExam: clinicalText,
  conduct: clinicalText,
  complementaryExams: clinicalText,
  hda: anamnesisText,
  hpp: anamnesisText,
  familyHistory: anamnesisText,
  psychosocial: anamnesisText,
  prescriptionItems: z.array(prescriptionItemFieldSchema),
});

export type ConsultationFormInput = z.infer<typeof consultationFormSchema>;

export const consultationIdSchema = z.object({
  id: z.string().uuid("ID inválido"),
});
export type ConsultationIdInput = z.infer<typeof consultationIdSchema>;
