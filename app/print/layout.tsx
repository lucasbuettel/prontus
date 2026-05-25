import { redirect } from "next/navigation";
import { getServerSession } from "@/features/auth/getServerProfile";

export default async function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) redirect("/login");
  if (!session.profile || session.profile.status !== "APPROVED") {
    redirect("/pending-approval");
  }

  return (
    <div className="mx-auto max-w-3xl bg-white px-6 py-8 text-foreground print:px-0 print:py-0">
      {children}
    </div>
  );
}
