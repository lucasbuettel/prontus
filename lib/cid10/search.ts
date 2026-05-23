import { CID10, type CidEntry } from "./data";

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

/**
 * Busca CIDs por código ou descrição (case-insensitive, sem acentos).
 * Retorna no máximo `limit` resultados.
 */
export function searchCid(
  query: string,
  limit = 12,
): CidEntry[] {
  const q = normalize(query);
  if (!q) return [];

  const codeMatches: CidEntry[] = [];
  const descMatches: CidEntry[] = [];

  for (const entry of CID10) {
    if (normalize(entry.code).startsWith(q)) {
      codeMatches.push(entry);
      continue;
    }
    if (normalize(entry.description).includes(q)) {
      descMatches.push(entry);
    }
  }

  return [...codeMatches, ...descMatches].slice(0, limit);
}
