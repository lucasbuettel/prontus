import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPatient } from "@/features/patients/getPatient";
import { getPatientComplementaryExams } from "@/features/complementary-exams/getExams";
import { ComplementaryExamsTable } from "@/features/complementary-exams/components/ComplementaryExamsTable";

interface PatientExamsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientExamsPage({
  params,
}: PatientExamsPageProps) {
  const { id: patientId } = await params;
  const [patient, exams] = await Promise.all([
    getPatient(patientId),
    getPatientComplementaryExams(patientId),
  ]);

  if (!patient) notFound();

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
          Exames complementares
        </h1>
        <p className="text-sm text-muted-foreground">{patient.full_name}</p>
      </header>

      <ComplementaryExamsTable patientId={patient.id} exams={exams} />
    </section>
  );
}
