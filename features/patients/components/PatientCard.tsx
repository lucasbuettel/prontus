import Link from "next/link";
import { calculateAge } from "../calculateAge";
import type { Patient } from "@/types/patient";

const SEX_LABEL: Record<NonNullable<Patient["sex"]>, string> = {
  M: "Masc.",
  F: "Fem.",
  OUTRO: "Outro",
};

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  const age = calculateAge(patient.birth_date);
  const subtitleParts: string[] = [];
  if (age !== null) subtitleParts.push(`${age} anos`);
  if (patient.sex) subtitleParts.push(SEX_LABEL[patient.sex]);
  if (patient.primary_cid) subtitleParts.push(`CID ${patient.primary_cid}`);

  return (
    <li>
      <Link
        href={`/patients/${patient.id}`}
        className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary/40 hover:bg-surface-muted"
      >
        <p className="truncate text-sm font-medium text-foreground">
          {patient.full_name}
        </p>
        {subtitleParts.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {subtitleParts.join(" · ")}
          </p>
        )}
      </Link>
    </li>
  );
}
