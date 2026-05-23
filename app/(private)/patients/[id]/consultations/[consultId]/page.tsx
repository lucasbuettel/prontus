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
import { getConsultationsByPatient } from "@/features/consultations/getConsultations";
import { numberConsultations } from "@/features/consultations/numberConsultations";
import { getPrescriptionItemsByConsultation } from "@/features/prescriptions/getPrescriptionItems";

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
  const [patient, consultation, allConsultations, prescriptionItems] =
    await Promise.all([
      getPatient(patientId),
      getConsultation(consultId),
      getConsultationsByPatient(patientId),
      getPrescriptionItemsByConsultation(consultId),
    ]);

  if (!patient || !consultation || consultation.patient_id !== patient.id) {
    notFound();
  }

  const numbers = numberConsultations(allConsultations);
  const number = numbers.get(consultation.id) ?? 0;
  const latestId = allConsultations[0]?.id;
  const isLatest = consultation.id === latestId;
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
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Atendimento {number}
            </h1>
            {isFirst && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                Inicial
              </span>
            )}
            {isLatest && (
              <span className="rounded-full border border-border-strong bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Mais recente
              </span>
            )}
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
              title="História familiar"
              value={consultation.family_history}
            />
            <Section title="Psicossocial" value={consultation.psychosocial} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Atendimento {number}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Section
            title="Medicação de uso contínuo"
            value={consultation.continuous_meds}
          />
          <Section title="Exame físico" value={consultation.physical_exam} />
          <Section title="Conduta" value={consultation.conduct} />
          <Section
            title="Exames complementares"
            value={consultation.complementary_exams}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prescrição</CardTitle>
        </CardHeader>
        <CardContent>
          {prescriptionItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum medicamento prescrito neste atendimento.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {prescriptionItems.map((item) => {
                const summary = [item.dosage, item.frequency, item.duration]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <li
                    key={item.id}
                    className="rounded-md border border-border bg-background p-3"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {item.drug_name}
                    </p>
                    {summary && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {summary}
                      </p>
                    )}
                    {item.instructions && (
                      <p className="mt-1 whitespace-pre-wrap text-xs text-foreground">
                        {item.instructions}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
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
