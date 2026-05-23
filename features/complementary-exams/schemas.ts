import { z } from "zod";

export const complementaryExamFormSchema = z.object({
  examDate: z
    .string()
    .regex(/^(\d{4}-\d{2}-\d{2})?$/, "Data inválida"),
  examName: z
    .string()
    .trim()
    .min(2, "Informe o nome do exame")
    .max(160, "Nome muito longo"),
  result: z.string().trim().max(2000, "Texto muito longo"),
  notes: z.string().trim().max(500, "Texto muito longo"),
});

export type ComplementaryExamFormInput = z.infer<
  typeof complementaryExamFormSchema
>;
