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

export default async function PendingApprovalPage() {
  const session = await getServerSession();

  if (!session) redirect("/login");
  if (session.profile?.status === "APPROVED") redirect("/patients");
  if (session.profile?.status === "REJECTED") redirect("/rejected");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aguardando aprovação</CardTitle>
        <CardDescription>
          Seu cadastro foi recebido e está em análise por um administrador.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
        <p>
          Você receberá acesso ao Prontus assim que seu cadastro for aprovado.
          Sinta-se à vontade para fechar esta página.
        </p>
        <p>
          Entrando como <strong className="text-foreground">{session.email}</strong>.
        </p>
        <div className="pt-2">
          <SignOutButton variant="secondary" />
        </div>
      </CardContent>
    </Card>
  );
}
