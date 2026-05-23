"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2 } from "lucide-react";
import { Button, Field, Input } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  complementaryExamFormSchema,
  type ComplementaryExamFormInput,
} from "../schemas";
import {
  createComplementaryExam,
  updateComplementaryExam,
  deleteComplementaryExam,
} from "../actions";
import type { PatientComplementaryExam } from "@/types/complementary_exam";

const textareaClasses = cn(
  "w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground shadow-sm",
  "placeholder:text-muted",
  "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
);

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

type Mode = "view" | "edit";

interface ExamRowProps {
  patientId: string;
  exam: PatientComplementaryExam;
}

export function ExamRow({ patientId, exam }: ExamRowProps) {
  const [mode, setMode] = useState<Mode>("view");

  if (mode === "edit") {
    return (
      <ExamForm
        patientId={patientId}
        exam={exam}
        onCancel={() => setMode("view")}
        onSaved={() => setMode("view")}
      />
    );
  }

  return (
    <ExamView
      patientId={patientId}
      exam={exam}
      onEdit={() => setMode("edit")}
    />
  );
}

function ExamView({
  patientId,
  exam,
  onEdit,
}: {
  patientId: string;
  exam: PatientComplementaryExam;
  onEdit: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteComplementaryExam(patientId, exam.id);
      if (!result.ok) {
        setError(result.error);
        setConfirming(false);
        return;
      }
      router.refresh();
    });
  }

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <p className="text-sm font-medium text-foreground">
            {exam.exam_name}
          </p>
          <span className="text-xs text-muted-foreground">
            {formatDate(exam.exam_date)}
          </span>
        </div>
        {exam.result && (
          <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
            {exam.result}
          </p>
        )}
        {exam.notes && (
          <p className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">
            {exam.notes}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-2 text-xs text-danger">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" aria-hidden />
          Editar
        </Button>

        {confirming ? (
          <>
            <Button
              variant="danger"
              size="sm"
              isLoading={isPending}
              onClick={handleDelete}
            >
              Confirmar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirming(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirming(true)}
          >
            <Trash2 className="h-3.5 w-3.5 text-danger" aria-hidden />
            Remover
          </Button>
        )}
      </div>
    </li>
  );
}

interface ExamFormProps {
  patientId: string;
  exam?: PatientComplementaryExam;
  onCancel: () => void;
  onSaved: () => void;
}

export function ExamForm({
  patientId,
  exam,
  onCancel,
  onSaved,
}: ExamFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ComplementaryExamFormInput>({
    resolver: zodResolver(complementaryExamFormSchema),
    defaultValues: {
      examDate: exam?.exam_date ?? "",
      examName: exam?.exam_name ?? "",
      result: exam?.result ?? "",
      notes: exam?.notes ?? "",
    },
  });

  function onSubmit(values: ComplementaryExamFormInput) {
    setServerError(null);
    startTransition(async () => {
      const result = exam
        ? await updateComplementaryExam(patientId, exam.id, values)
        : await createComplementaryExam(patientId, values);

      if (result.ok) {
        router.refresh();
        onSaved();
        return;
      }

      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          setError(field as keyof ComplementaryExamFormInput, { message });
        }
      }
      setServerError(result.error);
    });
  }

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-primary/40 bg-surface p-4">
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="Data" error={errors.examDate?.message}>
            <Input type="date" {...register("examDate")} />
          </Field>

          <Field
            label="Exame"
            error={errors.examName?.message}
            required
            className="sm:col-span-2"
          >
            <Input
              autoComplete="off"
              placeholder="Ex: Hemograma completo"
              {...register("examName")}
            />
          </Field>
        </div>

        <Field label="Resultado" error={errors.result?.message}>
          <textarea
            rows={3}
            className={textareaClasses}
            placeholder="Ex: Hemoglobina 14,2 g/dL. Leucócitos 7.500/mm³."
            {...register("result")}
          />
        </Field>

        <Field label="Observações" error={errors.notes?.message}>
          <textarea
            rows={2}
            className={textareaClasses}
            placeholder="Comentários adicionais."
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
            onClick={onCancel}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" size="sm" isLoading={isPending}>
            {exam ? "Salvar" : "Adicionar"}
          </Button>
        </div>
      </form>
    </li>
  );
}
