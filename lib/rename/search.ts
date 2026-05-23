import { RENAME, type DrugEntry } from "./data";

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

/**
 * Busca medicamentos por nome (case-insensitive, sem acentos).
 * Retorna no máximo `limit` resultados. Prioriza nomes que COMEÇAM com a
 * query antes dos que apenas contêm.
 */
export function searchDrug(query: string, limit = 10): DrugEntry[] {
  const q = normalize(query);
  if (!q) return [];

  const starts: DrugEntry[] = [];
  const contains: DrugEntry[] = [];

  for (const entry of RENAME) {
    const n = normalize(entry.name);
    if (n.startsWith(q)) starts.push(entry);
    else if (n.includes(q)) contains.push(entry);
  }

  return [...starts, ...contains].slice(0, limit);
}
