import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export default function RegisterRequestPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitar cadastro</CardTitle>
        <CardDescription>
          Após o envio, um administrador irá revisar e aprovar seu acesso.
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
