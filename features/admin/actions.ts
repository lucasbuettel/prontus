"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { userIdSchema, type UserIdInput } from "./schemas";
import type { UserRole, UserStatus } from "@/types/auth";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

interface UpdateOptions {
  blockIfSuperadmin?: boolean;
}

async function updateUserStatus(
  input: UserIdInput,
  nextStatus: UserStatus,
  options: UpdateOptions = {},
): Promise<ActionResult> {
  const parsed = userIdSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "ID de usuário inválido." };
  }

  const supabase = await createClient();

  if (options.blockIfSuperadmin) {
    const { data: target } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", parsed.data.userId)
      .maybeSingle<{ role: UserRole }>();

    if (target?.role === "SUPERADMIN") {
      return {
        ok: false,
        error: "Super admins não podem ser desativados.",
      };
    }
  }

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
  return updateUserStatus(input, "REJECTED", { blockIfSuperadmin: true });
}

export async function requeueUser(input: UserIdInput): Promise<ActionResult> {
  return updateUserStatus(input, "PENDING");
}
