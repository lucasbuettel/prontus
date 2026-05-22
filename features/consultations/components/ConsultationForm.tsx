"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  consultationFormSchema,
  type ConsultationFormInput,
} from "../schemas";
import {
  EMPTY_CONSULTATION_FORM,
} from "../toFormValues";
import { createConsultation, updateConsultation } from "../actions";
import type { ConsultationKind } from "@/types/consultation";

type ConsultationFormProps =
  | {
      mode: "create";
      patientId: string;
      kind: ConsultationKind;
      defaultValues?: Partial<ConsultationFormInput>;
      consultationId?: never;
    }
  | {
      mode: "edit";
      patientId: string;
      kind: ConsultationKind;
      defaultValues: Partial<ConsultationFormInput>;
      consultationId: string;
    };

const textareaClasses = cn(
  "w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground shadow-sm",
  "placeholder:text-muted",
  "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
);

export function ConsultationForm(props: ConsultationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ConsultationFormInput>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: { ...EMPTY_CONSULTATION_FORM, ...props.defaultValues },
  });

  function onSubmit(values: ConsultationFormInput) {
    setServerError(null);
    startTransition(async () => {
      const result =
        props.mode === "create"
          ? await createConsultation(props.patientId, values)
          : await updateConsultation(
              props.patientId,
              props.consultationId,
              values,
            );

      if (result.ok) {
        router.replace(
          `/patients/${props.patientId}/consultations/${result.id}`,
        );
        router.refresh();
        return;
      }

      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          setError(field as keyof ConsultationFormInput, { message });
        }
      }
      setServerError(result.error);
    });
  }

  const showAnamnesis = props.kind === "FIRST";

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {showAnamnesis && (
        <section className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Anamnese (primeira consulta)
          </h2>

          <Field label="HDA — História da doença atual" error={errors.hda?.message}>
            <textarea
              rows={4}
              className={textareaClasses}
              placeholder="Início, evolução, sintomas associados, fatores de melhora/piora..."
              {...register("hda")}
            />
          </Field>

          <Field label="HPP — História pregressa" error={errors.hpp?.message}>
            <textarea
              rows={3}
              className={textareaClasses}
              placeholder="Doenças prévias, cirurgias, alergias..."
              {...register("hpp")}
            />
          </Field>

          <Field
            label="Medicações contínuas"
            error={errors.continuousMeds?.message}
          >
            <textarea
              rows={3}
              className={textareaClasses}
              placeholder="Nome, dose, frequência..."
              {...register("continuousMeds")}
            />
          </Field>

          <Field
            label="História familiar"
            error={errors.familyHistory?.message}
          >
            <textarea
              rows={3}
              className={textareaClasses}
              placeholder="Doenças relevantes em familiares de 1º grau..."
              {...register("familyHistory")}
            />
          </Field>

          <Field
            label="Psicossocial"
            error={errors.psychosocial?.message}
          >
            <textarea
              rows={3}
              className={textareaClasses}
              placeholder="Trabalho, hábitos, suporte familiar, tabagismo, etilismo..."
              {...register("psychosocial")}
            />
          </Field>
        </section>
      )}

      <section className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Evolução SOAP
        </h2>

        <Field label="S — Subjetivo" error={errors.subjective?.message}>
          <textarea
            rows={3}
            className={textareaClasses}
            placeholder="Queixa atual, relato do paciente."
            {...register("subjective")}
          />
        </Field>

        <Field label="O — Objetivo" error={errors.objective?.message}>
          <textarea
            rows={3}
            className={textareaClasses}
            placeholder="Exame físico, sinais vitais, achados objetivos."
            {...register("objective")}
          />
        </Field>

        <Field label="A — Avaliação" error={errors.assessment?.message}>
          <textarea
            rows={3}
            className={textareaClasses}
            placeholder="Hipóteses diagnósticas, raciocínio clínico."
            {...register("assessment")}
          />
        </Field>

        <Field label="P — Plano" error={errors.plan?.message}>
          <textarea
            rows={3}
            className={textareaClasses}
            placeholder="Conduta, prescrição, exames solicitados, retorno."
            {...register("plan")}
          />
        </Field>
      </section>

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
          {props.mode === "create" ? "Registrar consulta" : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
