import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getConsultation } from "@/features/consultations/getConsultation";
import { getConsultationsByPatient } from "@/features/consultations/getConsultations";
import { numberConsultations } from "@/features/consultations/numberConsultations";
import { consultationToFormValues } from "@/features/consultations/toFormValues";
import { getPrescriptionItemsByConsultation } from "@/features/prescriptions/getPrescriptionItems";
import { ConsultationForm } from "@/features/consultations/components/ConsultationForm";

interface EditConsultationPageProps {
  params: Promise<{ id: string; consultId: string }>;
}

export default async function EditConsultationPage({
  params,
}: EditConsultationPageProps) {
  const { id: patientId, consultId } = await params;
  const [consultation, allConsultations, prescriptionItems] = await Promise.all([
    getConsultation(consultId),
    getConsultationsByPatient(patientId),
    getPrescriptionItemsByConsultation(consultId),
  ]);

  if (!consultation || consultation.patient_id !== patientId) notFound();

  const numbers = numberConsultations(allConsultations);
  const number = numbers.get(consultation.id) ?? 0;
  const latestId = allConsultations[0]?.id;
  const canEditPrescription = consultation.id === latestId;

  return (
    <section className="flex flex-col gap-4">
      <Link
        href={`/patients/${patientId}/consultations/${consultation.id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Voltar para o atendimento
      </Link>

      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Editar atendimento {number}
        </h1>
        <p className="text-sm text-muted-foreground">
          {consultation.kind === "FIRST"
            ? "Atendimento inicial (com anamnese)"
            : "Atendimento de retorno"}
        </p>
      </header>

      <ConsultationForm
        mode="edit"
        patientId={patientId}
        consultationId={consultation.id}
        kind={consultation.kind}
        number={number}
        canEditPrescription={canEditPrescription}
        defaultValues={consultationToFormValues(
          consultation,
          prescriptionItems,
        )}
      />
    </section>
  );
}
