import type { Consultation } from "@/types/consultation";

/**
 * Mapeia cada consulta para seu número sequencial (1, 2, 3...) baseado em
 * ordem cronológica ASC. Retorna Map<consultationId, number>.
 *
 * O número 1 sempre é o Atendimento 1 (kind='FIRST'), porque a regra do
 * banco força ele a ser o primeiro a existir.
 */
export function numberConsultations(
  consultations: Consultation[],
): Map<string, number> {
  const sorted = [...consultations].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
  const map = new Map<string, number>();
  sorted.forEach((c, index) => map.set(c.id, index + 1));
  return map;
}

/**
 * Retorna o próximo número de atendimento que será atribuído ao criar um novo.
 */
export function nextConsultationNumber(consultations: Consultation[]): number {
  return consultations.length + 1;
}
