import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PatientForm } from "@/features/patients/components/PatientForm";

export default function NewPatientPage() {
  return (
    <section className="flex flex-col gap-4">
      <Link
        href="/patients"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Voltar para pacientes
      </Link>

      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Novo paciente
        </h1>
        <p className="text-sm text-muted-foreground">
          Preencha os dados básicos. Você pode complementar o prontuário depois.
        </p>
      </header>

      <PatientForm mode="create" />
    </section>
  );
}
