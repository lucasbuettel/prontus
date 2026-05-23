import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPatient } from "@/features/patients/getPatient";
import { getConsultationsByPatient } from "@/features/consultations/getConsultations";
import { nextConsultationNumber } from "@/features/consultations/numberConsultations";
import { defaultsFromLastConsultation } from "@/features/consultations/toFormValues";
import { getPrescriptionItemsByConsultation } from "@/features/prescriptions/getPrescriptionItems";
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

  const consultations = await getConsultationsByPatient(patientId);
  const number = nextConsultationNumber(consultations);
  const kind: ConsultationKind = consultations.length === 0 ? "FIRST" : "RETURN";

  const lastConsultation = consultations[0] ?? null;
  const currentContinuousMeds =
    consultations.find((c) => c.continuous_meds && c.continuous_meds.trim())
      ?.continuous_meds ?? null;

  // Em RETURN, pré-popula valores comuns + prescrição do último atendimento.
  // Os itens vêm sem id (entram como novos no atendimento atual; o original
  // fica preservado no histórico). O médico edita / remove antes de salvar.
  const lastItems =
    kind === "RETURN" && lastConsultation
      ? await getPrescriptionItemsByConsultation(lastConsultation.id)
      : [];

  const defaultValues =
    kind === "RETURN"
      ? defaultsFromLastConsultation(lastConsultation, lastItems)
      : {};

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
          Atendimento {number}
          {kind === "FIRST" && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              (inicial — com anamnese)
            </span>
          )}
        </h1>
        <p className="text-sm text-muted-foreground">{patient.full_name}</p>
      </header>

      {kind === "RETURN" && (
        <ClinicalSnapshot
          patient={patient}
          lastConsultation={lastConsultation}
          currentContinuousMeds={currentContinuousMeds}
        />
      )}

      <ConsultationForm
        mode="create"
        patientId={patient.id}
        kind={kind}
        number={number}
        canEditPrescription
        defaultValues={defaultValues}
      />
    </section>
  );
}
