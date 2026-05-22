import { z } from "zod";

const soapText = z.string().trim().max(8000, "Texto muito longo");
const anamnesisText = z.string().trim().max(4000, "Texto muito longo");

export const consultationFormSchema = z.object({
  subjective: soapText,
  objective: soapText,
  assessment: soapText,
  plan: soapText,
  hda: anamnesisText,
  hpp: anamnesisText,
  continuousMeds: anamnesisText,
  familyHistory: anamnesisText,
  psychosocial: anamnesisText,
});

export type ConsultationFormInput = z.infer<typeof consultationFormSchema>;

export const consultationIdSchema = z.object({
  id: z.string().uuid("ID inválido"),
});
export type ConsultationIdInput = z.infer<typeof consultationIdSchema>;
