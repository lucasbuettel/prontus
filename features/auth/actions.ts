"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  registerRequestSchema,
  type LoginInput,
  type RegisterRequestInput,
} from "./schemas";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

function mapAuthError(message: string): string {
  if (/invalid login/i.test(message)) {
    return "E-mail ou senha inválidos.";
  }
  if (/already registered/i.test(message) || /already exists/i.test(message)) {
    return "Este e-mail já está cadastrado.";
  }
  if (/email not confirmed/i.test(message)) {
    return "Confirme seu e-mail antes de entrar.";
  }
  return "Não foi possível concluir a operação. Tente novamente.";
}

export async function signInWithPassword(
  input: LoginInput,
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { ok: false, error: mapAuthError(error.message) };
  }

  return { ok: true };
}

export async function signUpAsPending(
  input: RegisterRequestInput,
): Promise<ActionResult> {
  const parsed = registerRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
    },
  });

  if (error) {
    return { ok: false, error: mapAuthError(error.message) };
  }

  return { ok: true };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
