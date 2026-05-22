import { EmptyState } from "@/components/ui";
import { PatientCard } from "./PatientCard";
import type { Patient } from "@/types/patient";

interface PatientsListProps {
  patients: Patient[];
  hasQuery: boolean;
}

export function PatientsList({ patients, hasQuery }: PatientsListProps) {
  if (patients.length === 0) {
    return hasQuery ? (
      <EmptyState
        title="Nenhum paciente encontrado"
        description="Tente outro nome ou cadastre um novo paciente."
      />
    ) : (
      <EmptyState
        title="Sem pacientes ainda"
        description="Comece cadastrando o primeiro paciente."
      />
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </ul>
  );
}
