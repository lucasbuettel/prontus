"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { ExamRow, ExamForm } from "./ExamRow";
import type { PatientComplementaryExam } from "@/types/complementary_exam";

interface ComplementaryExamsTableProps {
  patientId: string;
  exams: PatientComplementaryExam[];
}

export function ComplementaryExamsTable({
  patientId,
  exams,
}: ComplementaryExamsTableProps) {
  const [adding, setAdding] = useState(false);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Exames complementares
        </h2>
        {!adding && (
          <Button size="sm" onClick={() => setAdding(true)}>
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Adicionar exame
          </Button>
        )}
      </div>

      <ul className="flex flex-col gap-2">
        {adding && (
          <ExamForm
            patientId={patientId}
            onCancel={() => setAdding(false)}
            onSaved={() => setAdding(false)}
          />
        )}
        {exams.length === 0 && !adding ? (
          <li className="rounded-md border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
            Nenhum exame registrado ainda.
          </li>
        ) : (
          exams.map((exam) => (
            <ExamRow key={exam.id} patientId={patientId} exam={exam} />
          ))
        )}
      </ul>
    </section>
  );
}
