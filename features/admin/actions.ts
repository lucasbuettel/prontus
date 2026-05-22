"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { userIdSchema, type UserIdInput } from "./schemas";
import type { UserStatus } from "@/types/auth";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

async function updateUserStatus(
  input: UserIdInput,
  nextStatus: UserStatus,
): Promise<ActionResult> {
  const parsed = userIdSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "ID de usuário inválido." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ status: nextStatus })
    .eq("id", parsed.data.userId);

  if (error) {
    console.error(`[admin/updateUserStatus → ${nextStatus}] error:`, error.message);
    return {
      ok: false,
      error:
        "Não foi possível atualizar o usuário. Verifique se você é SUPERADMIN.",
    };
  }

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function approveUser(input: UserIdInput): Promise<ActionResult> {
  return updateUserStatus(input, "APPROVED");
}

export async function rejectUser(input: UserIdInput): Promise<ActionResult> {
  return updateUserStatus(input, "REJECTED");
}

export async function requeueUser(input: UserIdInput): Promise<ActionResult> {
  return updateUserStatus(input, "PENDING");
}
