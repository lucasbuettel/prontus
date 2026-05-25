import Link from "next/link";
import { Printer } from "lucide-react";
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
    <li className="group relative rounded-lg border border-border bg-surface transition-colors hover:border-primary/40 hover:bg-surface-muted">
      <Link
        href={`/patients/${consultation.patient_id}/consultations/${consultation.id}`}
        className="absolute inset-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-label={`Abrir atendimento ${number}`}
      />
      <div className="pointer-events-none relative flex items-start gap-3 p-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
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
        </div>
        <Link
          href={`/print/consultations/${consultation.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto relative -m-1 inline-flex shrink-0 items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label={`Imprimir atendimento ${number}`}
          title="Imprimir"
        >
          <Printer className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </li>
  );
}
