"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field, Input } from "@/components/ui";
import { loginSchema, type LoginInput } from "../schemas";
import { signInWithPassword } from "../actions";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = await signInWithPassword(values);
      if (result.ok) {
        router.replace("/");
        router.refresh();
      } else {
        setServerError(result.error);
      }
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Field label="E-mail" error={errors.email?.message} required>
        <Input
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="voce@clinica.com"
          {...register("email")}
        />
      </Field>

      <Field label="Senha" error={errors.password?.message} required>
        <Input
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register("password")}
        />
      </Field>

      {serverError && (
        <p
          role="alert"
          className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger"
        >
          {serverError}
        </p>
      )}

      <Button type="submit" isLoading={isPending} fullWidth>
        Entrar
      </Button>
    </form>
  );
}
