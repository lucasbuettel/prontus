import { redirect } from "next/navigation";
import { getServerSession } from "@/features/auth/getServerProfile";
import {
  getUsersByStatus,
  countUsersByStatus,
} from "@/features/admin/getUsers";
import { userStatusFilterSchema } from "@/features/admin/schemas";
import { UsersAdminView } from "@/features/admin/components/UsersAdminView";

interface AdminUsersPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const session = await getServerSession();
  if (!session?.profile || session.profile.role !== "SUPERADMIN") {
    redirect("/patients");
  }

  const { status } = await searchParams;
  const parsed = userStatusFilterSchema.safeParse(status);
  const currentStatus = parsed.success ? parsed.data : "PENDING";

  const [users, counts] = await Promise.all([
    getUsersByStatus(currentStatus),
    countUsersByStatus(),
  ]);

  return (
    <UsersAdminView
      users={users}
      currentStatus={currentStatus}
      counts={counts}
    />
  );
}
