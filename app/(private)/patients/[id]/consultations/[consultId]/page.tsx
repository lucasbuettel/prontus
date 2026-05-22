import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import {
  buttonClasses,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { getPatient } from "@/features/patients/getPatient";
import { getConsultation } from "@/features/consultations/getConsultation";

interface ConsultationDetailPageProps {
  params: Promise<{ id: string; consultId: string }>;
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function ConsultationDetailPage({
  params,
}: ConsultationDetailPageProps) {
  const { id: patientId, consultId } = await params;
  const [patient, consultation] = await Promise.all([
    getPatient(patientId),
    getConsultation(consultId),
  ]);

  if (!patient || !consultation || consultation.patient_id !== patient.id) {
    notFound();
  }

  const isFirst = consultation.kind === "FIRST";

  return (
    <section className="flex flex-col gap-4">
      <Link
        href={`/patients/${patient.id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Voltar para o paciente
      </Link>

      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {isFirst ? "Primeira consulta" : "Consulta de retorno"}
            </h1>
            <span
              className={
                isFirst
                  ? "rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary"
                  : "rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
              }
            >
              {isFirst ? "FIRST" : "RETURN"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {patient.full_name} · {dateFormatter.format(new Date(consultation.created_at))}
          </p>
        </div>
        <Link
          href={`/patients/${patient.id}/consultations/${consultation.id}/edit`}
          className={buttonClasses({ variant: "secondary", size: "sm" })}
        >
          <Pencil className="h-4 w-4" aria-hidden />
          Editar
        </Link>
      </header>

      {isFirst && (
        <Card>
          <CardHeader>
            <CardTitle>Anamnese</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Section title="HDA" value={consultation.hda} />
            <Section title="HPP" value={consultation.hpp} />
            <Section
              title="Medicações contínuas"
              value={consultation.continuous_meds}
            />
            <Section
              title="História familiar"
              value={consultation.family_history}
            />
            <Section title="Psicossocial" value={consultation.psychosocial} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Evolução SOAP</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Section title="S — Subjetivo" value={consultation.subjective} />
          <Section title="O — Objetivo" value={consultation.objective} />
          <Section title="A — Avaliação" value={consultation.assessment} />
          <Section title="P — Plano" value={consultation.plan} />
        </CardContent>
      </Card>
    </section>
  );
}

function Section({ title, value }: { title: string; value: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </span>
      <p className="whitespace-pre-wrap text-sm text-foreground">
        {value?.trim() || <span className="text-muted-foreground">—</span>}
      </p>
    </div>
  );
}
