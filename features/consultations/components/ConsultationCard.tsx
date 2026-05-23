import Link from "next/link";
import type { Consultation } from "@/types/consultation";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

interface ConsultationCardProps {
  consultation: Consultation;
  number: number;
  isLatest: boolean;
}

export function ConsultationCard({
  consultation,
  number,
  isLatest,
}: ConsultationCardProps) {
  const preview =
    consultation.conduct?.trim() ||
    consultation.physical_exam?.trim() ||
    consultation.complementary_exams?.trim() ||
    "Sem evolução registrada.";

  return (
    <li>
      <Link
        href={`/patients/${consultation.patient_id}/consultations/${consultation.id}`}
        className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary/40 hover:bg-surface-muted"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            Atendimento {number}
          </span>
          {isLatest && (
            <span className="rounded-full border border-border-strong bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Mais recente
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {dateFormatter.format(new Date(consultation.created_at))}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-foreground">{preview}</p>
      </Link>
    </li>
  );
}
