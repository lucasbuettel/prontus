/**
 * Pure: calcula idade completa em anos a partir de uma data de nascimento ISO (YYYY-MM-DD).
 * Retorna null se a data for inválida ou estiver no futuro.
 * Usa o `today` injetável pra facilitar testes.
 */
export function calculateAge(
  birthDate: string | null | undefined,
  today: Date = new Date(),
): number | null {
  if (!birthDate) return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate);
  if (!match) return null;

  const [, y, m, d] = match;
  const birth = new Date(Number(y), Number(m) - 1, Number(d));
  if (Number.isNaN(birth.getTime())) return null;
  if (birth > today) return null;

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age -= 1;

  return age;
}
