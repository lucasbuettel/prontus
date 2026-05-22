import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { GoogleSignInButton } from "@/features/auth/components/GoogleSignInButton";

interface LoginPageProps {
  searchParams: Promise<{ error?: string; reason?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, reason } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar no Prontus</CardTitle>
        <CardDescription>
          Acesse com seu e-mail corporativo para continuar.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {error === "oauth" && (
          <div
            role="alert"
            className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger"
          >
            <p className="font-medium">Não foi possível concluir o login com Google.</p>
            {reason && (
              <p className="mt-1 text-xs text-danger/80 break-words">
                Detalhe: {reason}
              </p>
            )}
          </div>
        )}

        <LoginForm />

        <div className="flex items-center gap-2">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-wide text-muted">
            ou
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <GoogleSignInButton />

        <p className="text-center text-sm text-muted-foreground">
          Ainda não tem acesso?{" "}
          <Link
            href="/register-request"
            className="font-medium text-primary hover:underline"
          >
            Solicitar cadastro
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
