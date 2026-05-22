import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserStatus } from "@/types/auth";

export async function getUsersByStatus(status: UserStatus): Promise<Profile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .returns<Profile[]>();

  if (error) {
    console.error("[admin/getUsersByStatus] error:", error.message);
    return [];
  }

  return data ?? [];
}

export async function countUsersByStatus(): Promise<
  Record<UserStatus, number>
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("status")
    .returns<Pick<Profile, "status">[]>();

  const counts: Record<UserStatus, number> = {
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
  };

  if (error || !data) {
    if (error) console.error("[admin/countUsersByStatus] error:", error.message);
    return counts;
  }

  for (const row of data) {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  }
  return counts;
}
