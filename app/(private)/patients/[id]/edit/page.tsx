import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPatient } from "@/features/patients/getPatient";
import { patientToFormValues } from "@/features/patients/toFormValues";
import { PatientForm } from "@/features/patients/components/PatientForm";

interface EditPatientPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPatientPage({
  params,
}: EditPatientPageProps) {
  const { id } = await params;
  const patient = await getPatient(id);
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
          Editar paciente
        </h1>
        <p className="text-sm text-muted-foreground">
          {patient.full_name}
        </p>
      </header>

      <PatientForm
        mode="edit"
        patientId={patient.id}
        defaultValues={patientToFormValues(patient)}
      />
    </section>
  );
}
