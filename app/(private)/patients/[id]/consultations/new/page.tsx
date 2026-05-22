import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPatient } from "@/features/patients/getPatient";
import {
  getFirstConsultation,
  getLatestConsultation,
} from "@/features/consultations/getConsultations";
import { ConsultationForm } from "@/features/consultations/components/ConsultationForm";
import { ClinicalSnapshot } from "@/features/consultations/components/ClinicalSnapshot";
import type { ConsultationKind } from "@/types/consultation";

interface NewConsultationPageProps {
  params: Promise<{ id: string }>;
}

export default async function NewConsultationPage({
  params,
}: NewConsultationPageProps) {
  const { id: patientId } = await params;
  const patient = await getPatient(patientId);
  if (!patient) notFound();

  const [firstConsultation, lastConsultation] = await Promise.all([
    getFirstConsultation(patientId),
    getLatestConsultation(patientId),
  ]);

  const kind: ConsultationKind = firstConsultation ? "RETURN" : "FIRST";

  return (
    <section className="flex flex-col gap-4">
      <Link
        href={`/patients/${patient.id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Voltar para o paciente
      </Link>

      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {kind === "FIRST" ? "Primeira consulta" : "Consulta de retorno"}
        </h1>
        <p className="text-sm text-muted-foreground">{patient.full_name}</p>
      </header>

      {kind === "RETURN" && (
        <ClinicalSnapshot
          patient={patient}
          firstConsultation={firstConsultation}
          lastConsultation={lastConsultation}
        />
      )}

      <ConsultationForm mode="create" patientId={patient.id} kind={kind} />
    </section>
  );
}
