export function unmaskCpf(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

export function formatCpf(value: string): string {
  const digits = unmaskCpf(value);
  const parts: string[] = [];
  if (digits.length > 0) parts.push(digits.slice(0, 3));
  if (digits.length >= 4) parts[0] = `${digits.slice(0, 3)}.${digits.slice(3, 6)}`;
  if (digits.length >= 7) parts[0] = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}`;
  if (digits.length >= 10) parts[0] = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  return parts[0] ?? "";
}

export function isValidCpf(value: string): boolean {
  const cpf = unmaskCpf(value);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; // 000.000.000-00, 111..., etc.

  const calcDigit = (slice: string, factor: number): number => {
    let sum = 0;
    for (const ch of slice) {
      sum += Number(ch) * factor;
      factor -= 1;
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const d1 = calcDigit(cpf.slice(0, 9), 10);
  if (d1 !== Number(cpf[9])) return false;

  const d2 = calcDigit(cpf.slice(0, 10), 11);
  return d2 === Number(cpf[10]);
}
