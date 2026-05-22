import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getConsultation } from "@/features/consultations/getConsultation";
import { consultationToFormValues } from "@/features/consultations/toFormValues";
import { ConsultationForm } from "@/features/consultations/components/ConsultationForm";

interface EditConsultationPageProps {
  params: Promise<{ id: string; consultId: string }>;
}

export default async function EditConsultationPage({
  params,
}: EditConsultationPageProps) {
  const { id: patientId, consultId } = await params;
  const consultation = await getConsultation(consultId);

  if (!consultation || consultation.patient_id !== patientId) notFound();

  return (
    <section className="flex flex-col gap-4">
      <Link
        href={`/patients/${patientId}/consultations/${consultation.id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Voltar para a consulta
      </Link>

      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Editar consulta
        </h1>
        <p className="text-sm text-muted-foreground">
          {consultation.kind === "FIRST"
            ? "Primeira consulta"
            : "Consulta de retorno"}
        </p>
      </header>

      <ConsultationForm
        mode="edit"
        patientId={patientId}
        consultationId={consultation.id}
        kind={consultation.kind}
        defaultValues={consultationToFormValues(consultation)}
      />
    </section>
  );
}
