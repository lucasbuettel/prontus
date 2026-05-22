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
}

export function ConsultationCard({ consultation }: ConsultationCardProps) {
  const isFirst = consultation.kind === "FIRST";
  const preview =
    consultation.assessment?.trim() ||
    consultation.subjective?.trim() ||
    consultation.plan?.trim() ||
    "Sem evolução registrada.";

  return (
    <li>
      <Link
        href={`/patients/${consultation.patient_id}/consultations/${consultation.id}`}
        className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary/40 hover:bg-surface-muted"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={
              isFirst
                ? "rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary"
                : "rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
            }
          >
            {isFirst ? "Primeira consulta" : "Retorno"}
          </span>
          <span className="text-xs text-muted-foreground">
            {dateFormatter.format(new Date(consultation.created_at))}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-foreground">{preview}</p>
      </Link>
    </li>
  );
}
