import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { RegisterRequestForm } from "@/features/auth/components/RegisterRequestForm";

export default function RegisterRequestPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitar cadastro</CardTitle>
        <CardDescription>
          Após o envio, um administrador irá revisar e aprovar seu acesso.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <RegisterRequestForm />

        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
