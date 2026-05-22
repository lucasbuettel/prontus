import { redirect } from "next/navigation";
import { getServerSession } from "@/features/auth/getServerProfile";
import { AppShell } from "@/components/layout/AppShell";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) redirect("/login");
  if (!session.profile || session.profile.status === "PENDING") {
    redirect("/pending-approval");
  }
  if (session.profile.status === "REJECTED") redirect("/rejected");

  return (
    <AppShell profile={session.profile} email={session.email}>
      {children}
    </AppShell>
  );
}
