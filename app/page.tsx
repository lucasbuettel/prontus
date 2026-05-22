import { redirect } from "next/navigation";
import { getServerSession } from "@/features/auth/getServerProfile";

export default async function RootPage() {
  const session = await getServerSession();

  if (!session) redirect("/login");

  if (!session.profile) {
    // Trigger ainda não criou o profile, ou foi removido — trate como pendente.
    redirect("/pending-approval");
  }

  switch (session.profile.status) {
    case "PENDING":
      redirect("/pending-approval");
    case "REJECTED":
      redirect("/rejected");
    case "APPROVED":
      redirect("/patients");
  }
}
