import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar no Prontus</CardTitle>
        <CardDescription>
          Acesse com seu e-mail corporativo para continuar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Formulário disponível na próxima etapa (Fase 1 — Auth).
        </p>
      </CardContent>
    </Card>
  );
}
