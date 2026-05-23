"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  Button,
  Field,
  Input,
  MaskedInput,
  type AutocompleteOption,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { patientFormSchema, type PatientFormInput } from "../schemas";
import { createPatient, updatePatient } from "../actions";
import { searchCid } from "@/lib/cid10/search";

type PatientFormProps =
  | { mode: "create"; defaultValues?: Partial<PatientFormInput>; patientId?: never }
  | { mode: "edit"; defaultValues: Partial<PatientFormInput>; patientId: string };

const EMPTY_DEFAULTS: PatientFormInput = {
  fullName: "",
  recordNumber: "",
  birthDate: "",
  sex: "" as never,
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

interface CidFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name: string;
}

function CidField({ value, onChange, onBlur, name }: CidFieldProps) {
  const fetchOptions = useCallback((q: string): AutocompleteOption[] => {
    return searchCid(q).map((entry) => ({
      value: entry.code,
      label: entry.code,
      secondary: entry.description,
    }));
  }, []);

  return (
    <Autocomplete
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      name={name}
      fetchOptions={fetchOptions}
      placeholder="Ex: I10 ou hipertensão"
      emptyLabel="Sem código sugerido. Você pode digitar livremente."
    />
  );
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
        <Field
          label="Prontuário"
          error={errors.recordNumber?.message}
          required
          hint="Número/código único do paciente na clínica."
        >
          <Input
            autoComplete="off"
            placeholder="Ex: 00123 ou ABC-001"
            {...register("recordNumber")}
          />
        </Field>

        <Field label="Data de nascimento" error={errors.birthDate?.message} required>
          <Input type="date" {...register("birthDate")} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Sexo" error={errors.sex?.message} required>
          <select
            className={cn(
              "h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-sm text-foreground shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
            )}
            {...register("sex")}
          >
            <option value="">Selecione</option>
            <option value="F">Feminino</option>
            <option value="M">Masculino</option>
            <option value="OUTRO">Outro</option>
          </select>
        </Field>

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
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        <Field
          label="CID principal"
          error={errors.primaryCid?.message}
          hint="Digite o código ou descrição. Texto livre permitido."
        >
          <Controller
            name="primaryCid"
            control={control}
            render={({ field }) => (
              <CidField
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
              />
            )}
          />
        </Field>
      </div>

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
