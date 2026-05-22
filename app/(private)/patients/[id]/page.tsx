import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { buttonClasses, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { getPatient } from "@/features/patients/getPatient";
import { calculateAge } from "@/features/patients/calculateAge";
import { formatCpf } from "@/lib/format/cpf";
import { formatPhoneBr } from "@/lib/format/phone";

interface PatientDetailPageProps {
  params: Promise<{ id: string }>;
}

const SEX_LABEL: Record<"M" | "F" | "OUTRO", string> = {
  M: "Masculino",
  F: "Feminino",
  OUTRO: "Outro",
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default async function PatientDetailPage({
  params,
}: PatientDetailPageProps) {
  const { id } = await params;
  const patient = await getPatient(id);
  if (!patient) notFound();

  const age = calculateAge(patient.birth_date);

  return (
    <section className="flex flex-col gap-4">
      <Link
        href="/patients"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Voltar para pacientes
      </Link>

      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {patient.full_name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {age !== null ? `${age} anos · ` : ""}
            {patient.sex ? SEX_LABEL[patient.sex] : "Sexo não informado"}
          </p>
        </div>
        <Link
          href={`/patients/${patient.id}/edit`}
          className={buttonClasses({ variant: "secondary", size: "sm" })}
        >
          <Pencil className="h-4 w-4" aria-hidden />
          Editar
        </Link>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Dados cadastrais</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailRow label="Data de nascimento" value={formatDate(patient.birth_date)} />
          <DetailRow label="CPF" value={patient.cpf ? formatCpf(patient.cpf) : "—"} />
          <DetailRow label="Celular" value={patient.phone ? formatPhoneBr(patient.phone) : "—"} />
          <DetailRow label="CID principal" value={patient.primary_cid ?? "—"} />
        </CardContent>
      </Card>

      {patient.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm text-foreground">
              {patient.notes}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Consultas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Em construção. Será habilitado na Fase 3.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}
