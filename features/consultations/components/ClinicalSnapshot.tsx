import { differenceInCalendarDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { calculateAge } from "@/features/patients/calculateAge";
import type { Patient } from "@/types/patient";
import type { Consultation } from "@/types/consultation";

const SEX_LABEL: Record<"M" | "F" | "OUTRO", string> = {
  M: "Masculino",
  F: "Feminino",
  OUTRO: "Outro",
};

interface ClinicalSnapshotProps {
  patient: Patient;
  firstConsultation: Consultation | null;
  lastConsultation: Consultation | null;
}

export function ClinicalSnapshot({
  patient,
  firstConsultation,
  lastConsultation,
}: ClinicalSnapshotProps) {
  const age = calculateAge(patient.birth_date);
  const sex = patient.sex ? SEX_LABEL[patient.sex] : null;

  const headerParts: string[] = [];
  if (age !== null) headerParts.push(`${age} anos`);
  if (sex) headerParts.push(sex);
  if (patient.primary_cid) headerParts.push(`CID ${patient.primary_cid}`);

  const daysSince = lastConsultation
    ? differenceInCalendarDays(
        new Date(),
        new Date(lastConsultation.created_at),
      )
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo clínico</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {headerParts.length > 0 && (
          <p className="text-sm text-foreground">{headerParts.join(" · ")}</p>
        )}

        {daysSince !== null && (
          <p className="text-xs text-muted-foreground">
            Última consulta{" "}
            {daysSince === 0
              ? "hoje"
              : daysSince === 1
                ? "ontem"
                : `há ${daysSince} dias`}
            .
          </p>
        )}

        {firstConsultation?.continuous_meds && (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Medicações contínuas
            </span>
            <p className="whitespace-pre-wrap text-sm text-foreground">
              {firstConsultation.continuous_meds}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
