import { notFound } from "next/navigation";
import { getPatient } from "@/features/patients/getPatient";
import { getConsultation } from "@/features/consultations/getConsultation";
import { getConsultationsByPatient } from "@/features/consultations/getConsultations";
import { numberConsultations } from "@/features/consultations/numberConsultations";
import { getPrescriptionItemsByConsultation } from "@/features/prescriptions/getPrescriptionItems";
import { AutoPrint } from "../../AutoPrint";

interface PrintConsultationPageProps {
  params: Promise<{ consultId: string }>;
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const dateOnlyFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default async function PrintConsultationPage({
  params,
}: PrintConsultationPageProps) {
  const { consultId } = await params;

  const consultation = await getConsultation(consultId);
  if (!consultation) notFound();

  const [patient, allConsultations, prescriptionItems] = await Promise.all([
    getPatient(consultation.patient_id),
    getConsultationsByPatient(consultation.patient_id),
    getPrescriptionItemsByConsultation(consultId),
  ]);

  if (!patient) notFound();

  const numbers = numberConsultations(allConsultations);
  const number = numbers.get(consultation.id) ?? 0;
  const isFirst = consultation.kind === "FIRST";

  return (
    <article className="flex flex-col gap-6 text-sm leading-relaxed text-foreground">
      <AutoPrint />

      <header className="flex flex-col gap-2 border-b border-border pb-4">
        <h1 className="text-xl font-semibold tracking-tight">
          Atendimento {number}
          {isFirst && (
            <span className="ml-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              (inicial)
            </span>
          )}
        </h1>
        <p className="text-xs text-muted-foreground">
          {dateFormatter.format(new Date(consultation.created_at))}
        </p>

        <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
          <PatientLine label="Paciente" value={patient.full_name} />
          {patient.record_number && (
            <PatientLine label="Prontuário" value={patient.record_number} />
          )}
          {patient.birth_date && (
            <PatientLine
              label="Nascimento"
              value={dateOnlyFormatter.format(new Date(patient.birth_date))}
            />
          )}
          {patient.sex && <PatientLine label="Sexo" value={patient.sex} />}
          {patient.cpf && <PatientLine label="CPF" value={patient.cpf} />}
          {patient.phone && (
            <PatientLine label="Telefone" value={patient.phone} />
          )}
          {patient.primary_cid && (
            <PatientLine label="CID" value={patient.primary_cid} />
          )}
        </dl>
      </header>

      <section className="flex flex-col gap-4">
        {isFirst && (
          <>
            <PrintSection title="HDA" value={consultation.hda} />
            <PrintSection title="HPP" value={consultation.hpp} />
          </>
        )}
        <PrintSection
          title="Medicação de uso contínuo"
          value={consultation.continuous_meds}
        />
        {isFirst && (
          <>
            <PrintSection
              title="História familiar"
              value={consultation.family_history}
            />
            <PrintSection
              title="Psicossocial"
              value={consultation.psychosocial}
            />
          </>
        )}
        <PrintSection
          title="Exame físico"
          value={consultation.physical_exam}
        />
        <PrintSection
          title="Exames complementares"
          value={consultation.complementary_exams}
        />
        <PrintSection title="Conduta" value={consultation.conduct} />
      </section>

      <section className="flex flex-col gap-2 border-t border-border pt-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Prescrição
        </h2>
        {prescriptionItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum medicamento prescrito neste atendimento.
          </p>
        ) : (
          <ol className="flex flex-col gap-3 pl-4">
            {prescriptionItems.map((item) => {
              const summary = [item.dosage, item.frequency, item.duration]
                .filter(Boolean)
                .join(" · ");
              return (
                <li key={item.id} className="list-decimal">
                  <p className="text-sm font-medium">{item.drug_name}</p>
                  {summary && (
                    <p className="text-xs text-muted-foreground">{summary}</p>
                  )}
                  {item.instructions && (
                    <p className="mt-0.5 whitespace-pre-wrap text-xs">
                      {item.instructions}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <footer className="mt-8 border-t border-border pt-12">
        <div className="mx-auto w-64 border-t border-foreground pt-1 text-center text-xs">
          Assinatura do médico
        </div>
      </footer>
    </article>
  );
}

function PatientLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1">
      <dt className="font-medium text-muted-foreground">{label}:</dt>
      <dd>{value}</dd>
    </div>
  );
}

function PrintSection({
  title,
  value,
}: {
  title: string;
  value: string | null;
}) {
  return (
    <div className="flex flex-col gap-0.5 break-inside-avoid">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </span>
      <p className="whitespace-pre-wrap text-sm">
        {value?.trim() || <span className="text-muted-foreground">—</span>}
      </p>
    </div>
  );
}
