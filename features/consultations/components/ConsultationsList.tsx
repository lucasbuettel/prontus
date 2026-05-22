import { EmptyState } from "@/components/ui";
import { ConsultationCard } from "./ConsultationCard";
import type { Consultation } from "@/types/consultation";

interface ConsultationsListProps {
  consultations: Consultation[];
}

export function ConsultationsList({ consultations }: ConsultationsListProps) {
  if (consultations.length === 0) {
    return (
      <EmptyState
        title="Sem consultas ainda"
        description="Registre a primeira consulta deste paciente."
      />
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {consultations.map((c) => (
        <ConsultationCard key={c.id} consultation={c} />
      ))}
    </ul>
  );
}
