"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field, Input, MaskedInput } from "@/components/ui";
import { cn } from "@/lib/cn";
import { patientFormSchema, type PatientFormInput } from "../schemas";
import { createPatient, updatePatient } from "../actions";

type PatientFormProps =
  | { mode: "create"; defaultValues?: Partial<PatientFormInput>; patientId?: never }
  | { mode: "edit"; defaultValues: Partial<PatientFormInput>; patientId: string };

const EMPTY_DEFAULTS: PatientFormInput = {
  fullName: "",
  birthDate: "",
  sex: "",
  cpf: "",
  phone: "",
  primaryCid: "",
  notes: "",
};

function toFormValues(
  defaults: Partial<PatientFormInput> | undefined,
): PatientFormInput {
  return { ...EMPTY_DEFAULTS, ...defaults };
}

export function PatientForm(props: PatientFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<PatientFormInput>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: toFormValues(props.defaultValues),
  });

  function onSubmit(values: PatientFormInput) {
    setServerError(null);
    startTransition(async () => {
      const result =
        props.mode === "create"
          ? await createPatient(values)
          : await updatePatient(props.patientId, values);

      if (result.ok) {
        router.replace(`/patients/${result.id}`);
        router.refresh();
        return;
      }

      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          setError(field as keyof PatientFormInput, { message });
        }
      }
      setServerError(result.error);
    });
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Field label="Nome completo" error={errors.fullName?.message} required>
        <Input
          autoComplete="off"
          placeholder="Ex: Maria da Silva"
          {...register("fullName")}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Data de nascimento" error={errors.birthDate?.message}>
          <Input type="date" {...register("birthDate")} />
        </Field>

        <Field label="Sexo" error={errors.sex?.message}>
          <select
            className={cn(
              "h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-sm text-foreground shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
            )}
            {...register("sex")}
          >
            <option value="">—</option>
            <option value="F">Feminino</option>
            <option value="M">Masculino</option>
            <option value="OUTRO">Outro</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="CPF" error={errors.cpf?.message}>
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <MaskedInput
                mask="cpf"
                inputMode="numeric"
                placeholder="000.000.000-00"
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            )}
          />
        </Field>

        <Field label="Celular" error={errors.phone?.message}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <MaskedInput
                mask="phoneBr"
                inputMode="tel"
                placeholder="(11) 91234-5678"
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            )}
          />
        </Field>
      </div>

      <Field
        label="CID principal"
        error={errors.primaryCid?.message}
        hint="Ex: I10, E11.9 — pode preencher depois."
      >
        <Input placeholder="I10" {...register("primaryCid")} />
      </Field>

      <Field label="Observações" error={errors.notes?.message}>
        <textarea
          rows={4}
          className={cn(
            "w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground shadow-sm",
            "placeholder:text-muted",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
          )}
          placeholder="Anotações livres sobre o paciente."
          {...register("notes")}
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

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={isPending}>
          {props.mode === "create" ? "Cadastrar paciente" : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
