"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field, Input } from "@/components/ui";
import {
  registerRequestSchema,
  type RegisterRequestInput,
} from "../schemas";
import { signUpAsPending } from "../actions";

export function RegisterRequestForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterRequestInput>({
    resolver: zodResolver(registerRequestSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: RegisterRequestInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = await signUpAsPending(values);
      if (result.ok) {
        setSuccess(true);
        reset();
      } else {
        setServerError(result.error);
      }
    });
  };

  if (success) {
    return (
      <div
        role="status"
        className="rounded-md border border-success/30 bg-success/5 px-4 py-3 text-sm text-success"
      >
        Solicitação enviada! Um administrador irá revisar e aprovar seu acesso.
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Field label="Nome completo" error={errors.fullName?.message} required>
        <Input
          autoComplete="name"
          placeholder="Maria da Silva"
          {...register("fullName")}
        />
      </Field>

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
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          {...register("password")}
        />
      </Field>

      <Field
        label="Confirmar senha"
        error={errors.confirmPassword?.message}
        required
      >
        <Input
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
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
        Solicitar cadastro
      </Button>
    </form>
  );
}
