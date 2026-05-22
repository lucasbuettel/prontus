import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonClasses } from "@/components/ui";
import { getPatients } from "@/features/patients/getPatients";
import { PatientSearch } from "@/features/patients/components/PatientSearch";
import { PatientsList } from "@/features/patients/components/PatientsList";

interface PatientsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function PatientsPage({
  searchParams,
}: PatientsPageProps) {
  const { q } = await searchParams;
  const patients = await getPatients({ q });

  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Pacientes
          </h1>
          <p className="text-sm text-muted-foreground">
            Cadastro, busca e prontuário.
          </p>
        </div>
        <Link
          href="/patients/new"
          className={buttonClasses({ size: "md" })}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Novo paciente
        </Link>
      </header>

      <PatientSearch initialQuery={q ?? ""} />

      <PatientsList patients={patients} hasQuery={Boolean(q?.trim())} />
    </section>
  );
}
