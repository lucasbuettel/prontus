import { EmptyState } from "@/components/ui";
import { ConsultationCard } from "./ConsultationCard";
import { numberConsultations } from "../numberConsultations";
import type { Consultation } from "@/types/consultation";

interface ConsultationsListProps {
  consultations: Consultation[];
}

export function ConsultationsList({ consultations }: ConsultationsListProps) {
  if (consultations.length === 0) {
    return (
      <EmptyState
        title="Sem atendimentos ainda"
        description="Registre o primeiro atendimento deste paciente."
      />
    );
  }

  const numbers = numberConsultations(consultations);
  const latestId = consultations[0]?.id;

  return (
    <ul className="flex flex-col gap-2">
      {consultations.map((c) => (
        <ConsultationCard
          key={c.id}
          consultation={c}
          number={numbers.get(c.id) ?? 0}
          isLatest={c.id === latestId}
        />
      ))}
    </ul>
  );
}
