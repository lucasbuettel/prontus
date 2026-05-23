"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import {
  Autocomplete,
  Button,
  Field,
  Input,
  type AutocompleteOption,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  consultationFormSchema,
  type ConsultationFormInput,
} from "../schemas";
import {
  EMPTY_CONSULTATION_FORM,
  EMPTY_PRESCRIPTION_ITEM,
} from "../toFormValues";
import { createConsultation, updateConsultation } from "../actions";
import type { ConsultationKind } from "@/types/consultation";
import { searchDrug } from "@/lib/rename/search";

type ConsultationFormProps =
  | {
      mode: "create";
      patientId: string;
      kind: ConsultationKind;
      number: number;
      canEditPrescription: boolean;
      defaultValues?: Partial<ConsultationFormInput>;
      consultationId?: never;
    }
  | {
      mode: "edit";
      patientId: string;
      kind: ConsultationKind;
      number: number;
      canEditPrescription: boolean;
      defaultValues: Partial<ConsultationFormInput>;
      consultationId: string;
    };

const textareaClasses = cn(
  "w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground shadow-sm",
  "placeholder:text-muted",
  "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
);

interface DrugFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name: string;
  disabled?: boolean;
}

function DrugField({ value, onChange, onBlur, name, disabled }: DrugFieldProps) {
  const fetchOptions = useCallback((q: string): AutocompleteOption[] => {
    return searchDrug(q).map((entry) => ({
      value: entry.name,
      label: entry.name,
    }));
  }, []);

  return (
    <Autocomplete
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      name={name}
      disabled={disabled}
      fetchOptions={fetchOptions}
      minChars={2}
      placeholder="Ex: Dipirona 500mg"
      emptyLabel="Não está na RENAME. Você pode prescrever assim mesmo."
    />
  );
}

export function ConsultationForm(props: ConsultationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<ConsultationFormInput>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: { ...EMPTY_CONSULTATION_FORM, ...props.defaultValues },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prescriptionItems",
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
  const prescriptionErrors = errors.prescriptionItems;

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {showAnamnesis && (
        <section className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Anamnese (atendimento 1)
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

          <Field label="Psicossocial" error={errors.psychosocial?.message}>
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
          Atendimento {props.number}
        </h2>

        <Field
          label="Medicação de uso contínuo"
          error={errors.continuousMeds?.message}
          hint="Atualize sempre que houver mudança. O histórico fica preservado em cada atendimento."
        >
          <textarea
            rows={3}
            className={textareaClasses}
            placeholder="Nome, dose, frequência das medicações que o paciente usa atualmente."
            {...register("continuousMeds")}
          />
        </Field>

        <Field label="Exame físico" error={errors.physicalExam?.message}>
          <textarea
            rows={4}
            className={textareaClasses}
            placeholder="Sinais vitais, exame segmentar, achados objetivos."
            {...register("physicalExam")}
          />
        </Field>

        <Field label="Conduta" error={errors.conduct?.message}>
          <textarea
            rows={4}
            className={textareaClasses}
            placeholder="Hipóteses diagnósticas, plano terapêutico, orientações, retorno."
            {...register("conduct")}
          />
        </Field>

        <Field
          label="Exames complementares"
          error={errors.complementaryExams?.message}
          hint="Resultados ou pedidos discutidos neste atendimento."
        >
          <textarea
            rows={3}
            className={textareaClasses}
            placeholder="Ex: solicitado hemograma e TSH. Glicemia de jejum 95 mg/dL."
            {...register("complementaryExams")}
          />
        </Field>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Prescrição
          </h2>
          {props.canEditPrescription && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => append({ ...EMPTY_PRESCRIPTION_ITEM })}
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Adicionar medicamento
            </Button>
          )}
        </div>

        {!props.canEditPrescription && (
          <p className="rounded-md border border-border bg-surface-muted px-3 py-2 text-xs text-muted-foreground">
            Atendimentos anteriores ficam como histórico. Para alterar a
            prescrição, registre um novo atendimento.
          </p>
        )}

        {fields.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-3 py-4 text-center text-sm text-muted-foreground">
            {props.canEditPrescription
              ? "Nenhum medicamento. Clique em \"Adicionar medicamento\" para incluir."
              : "Nenhum medicamento prescrito neste atendimento."}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {fields.map((field, index) => {
              const itemErrors = prescriptionErrors?.[index];
              return (
                <li
                  key={field.id}
                  className="flex flex-col gap-3 rounded-md border border-border bg-background p-3"
                >
                  <Field
                    label={`Medicamento #${index + 1}`}
                    error={itemErrors?.drugName?.message}
                    required
                    hint="Digite 2+ letras para sugestões da RENAME."
                  >
                    <Controller
                      name={`prescriptionItems.${index}.drugName`}
                      control={control}
                      render={({ field }) => (
                        <DrugField
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          disabled={!props.canEditPrescription}
                        />
                      )}
                    />
                  </Field>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Field
                      label="Posologia"
                      error={itemErrors?.dosage?.message}
                    >
                      <Input
                        placeholder="1 cp"
                        disabled={!props.canEditPrescription}
                        {...register(`prescriptionItems.${index}.dosage`)}
                      />
                    </Field>

                    <Field
                      label="Frequência"
                      error={itemErrors?.frequency?.message}
                    >
                      <Input
                        placeholder="8/8h"
                        disabled={!props.canEditPrescription}
                        {...register(`prescriptionItems.${index}.frequency`)}
                      />
                    </Field>

                    <Field
                      label="Duração"
                      error={itemErrors?.duration?.message}
                    >
                      <Input
                        placeholder="7 dias"
                        disabled={!props.canEditPrescription}
                        {...register(`prescriptionItems.${index}.duration`)}
                      />
                    </Field>
                  </div>

                  <Field
                    label="Orientações"
                    error={itemErrors?.instructions?.message}
                  >
                    <textarea
                      rows={2}
                      className={textareaClasses}
                      placeholder="Como tomar, cuidados, observações..."
                      disabled={!props.canEditPrescription}
                      {...register(`prescriptionItems.${index}.instructions`)}
                    />
                  </Field>

                  {props.canEditPrescription && (
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-danger" aria-hidden />
                        Remover
                      </Button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
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
          {props.mode === "create" ? "Registrar atendimento" : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
