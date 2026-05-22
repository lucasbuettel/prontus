import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { getServerSession } from "@/features/auth/getServerProfile";
import { SignOutButton } from "@/features/auth/components/SignOutButton";

export default async function RejectedPage() {
  const session = await getServerSession();

  if (!session) redirect("/login");
  if (session.profile?.status === "APPROVED") redirect("/patients");
  if (session.profile?.status === "PENDING") redirect("/pending-approval");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acesso negado</CardTitle>
        <CardDescription>
          Sua solicitação de cadastro não foi aprovada.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
        <p>
          Em caso de dúvida, procure o administrador da sua clínica para mais
          informações.
        </p>
        <div className="pt-2">
          <SignOutButton variant="secondary" />
        </div>
      </CardContent>
    </Card>
  );
}
