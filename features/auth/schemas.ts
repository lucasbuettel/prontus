import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerRequestSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Informe seu nome completo")
      .max(120, "Nome muito longo"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(8, "A senha deve ter ao menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não conferem",
  });
export type RegisterRequestInput = z.infer<typeof registerRequestSchema>;
