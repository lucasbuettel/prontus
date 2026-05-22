export function unmaskPhone(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

export function formatPhoneBr(value: string): string {
  const digits = unmaskPhone(value);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    // Formato fixo enquanto não tem o 11º dígito: (XX) XXXX-XXXX
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  }
  // Celular completo: (XX) 9XXXX-XXXX
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

/**
 * Aceita apenas celular brasileiro: 11 dígitos, DDD válido (11-99),
 * e 3º dígito (após DDD) igual a 9.
 */
export function isValidMobilePhoneBr(value: string): boolean {
  const digits = unmaskPhone(value);
  if (digits.length !== 11) return false;
  const ddd = Number(digits.slice(0, 2));
  if (ddd < 11 || ddd > 99) return false;
  if (digits[2] !== "9") return false;
  return true;
}
