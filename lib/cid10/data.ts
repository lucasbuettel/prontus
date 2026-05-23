/**
 * CID-10 — subset dos códigos mais comuns em atendimento ambulatorial.
 *
 * Esta lista é intencionalmente pequena (cobertura de uso real, não
 * exaustiva). Pra expandir, copie a tabela completa do DataSUS
 * (http://www2.datasus.gov.br/cid10/V2008/cid10.htm) ou WHO ICD API.
 *
 * Mantenha o shape { code, description } — o componente CidAutocomplete
 * lida com qualquer tamanho de lista. Texto livre também é permitido
 * (entradas fora da lista).
 */
export interface CidEntry {
  code: string;
  description: string;
}

export const CID10: CidEntry[] = [
  // Cardiovascular
  { code: "I10", description: "Hipertensão essencial (primária)" },
  { code: "I11", description: "Doença cardíaca hipertensiva" },
  { code: "I20.9", description: "Angina pectoris não especificada" },
  { code: "I25.1", description: "Doença aterosclerótica do coração" },
  { code: "I48", description: "Fibrilação e flutter atrial" },
  { code: "I50.0", description: "Insuficiência cardíaca congestiva" },
  { code: "I63.9", description: "Infarto cerebral não especificado" },
  { code: "I64", description: "Acidente vascular cerebral não especificado" },
  { code: "I80.2", description: "Trombose venosa profunda de MMII" },
  { code: "I83.9", description: "Varizes dos MMII sem úlcera ou inflamação" },

  // Endócrino e metabólico
  { code: "E03.9", description: "Hipotireoidismo não especificado" },
  { code: "E05.0", description: "Hipertireoidismo com bócio difuso" },
  { code: "E10.9", description: "Diabetes mellitus tipo 1 sem complicações" },
  { code: "E11.9", description: "Diabetes mellitus tipo 2 sem complicações" },
  { code: "E11.65", description: "Diabetes tipo 2 com hiperglicemia" },
  { code: "E66.0", description: "Obesidade devida a excesso de calorias" },
  { code: "E66.9", description: "Obesidade não especificada" },
  { code: "E78.0", description: "Hipercolesterolemia pura" },
  { code: "E78.5", description: "Dislipidemia não especificada" },
  { code: "E79.0", description: "Hiperuricemia sem sinais de artrite" },

  // Respiratório
  { code: "J00", description: "Nasofaringite aguda (resfriado comum)" },
  { code: "J02.9", description: "Faringite aguda não especificada" },
  { code: "J03.9", description: "Amigdalite aguda não especificada" },
  { code: "J06.9", description: "Infecção aguda das vias aéreas superiores" },
  { code: "J18.9", description: "Pneumonia não especificada" },
  { code: "J20.9", description: "Bronquite aguda não especificada" },
  { code: "J30.4", description: "Rinite alérgica não especificada" },
  { code: "J32.9", description: "Sinusite crônica não especificada" },
  { code: "J44.9", description: "DPOC não especificada" },
  { code: "J45.9", description: "Asma não especificada" },

  // Digestivo
  { code: "K21.0", description: "Doença do refluxo gastroesofágico com esofagite" },
  { code: "K21.9", description: "DRGE sem esofagite" },
  { code: "K25.9", description: "Úlcera gástrica não especificada" },
  { code: "K29.7", description: "Gastrite não especificada" },
  { code: "K30", description: "Dispepsia" },
  { code: "K52.9", description: "Gastroenterite e colite não infecciosas" },
  { code: "K58.9", description: "Síndrome do intestino irritável" },
  { code: "K59.0", description: "Constipação" },
  { code: "K76.0", description: "Esteatose hepática não classificada" },
  { code: "K80.2", description: "Cálculo da vesícula biliar sem colecistite" },

  // Geniturinário
  { code: "N18.9", description: "Doença renal crônica não especificada" },
  { code: "N30.0", description: "Cistite aguda" },
  { code: "N39.0", description: "Infecção do trato urinário, local não especificado" },
  { code: "N40", description: "Hiperplasia prostática" },
  { code: "N76.0", description: "Vaginite aguda" },
  { code: "N92.0", description: "Menstruação excessiva ou frequente" },
  { code: "N94.6", description: "Dismenorreia não especificada" },
  { code: "N95.1", description: "Estados menopáusicos e climatéricos femininos" },

  // Musculoesquelético
  { code: "M05.9", description: "Artrite reumatoide soropositiva" },
  { code: "M10.9", description: "Gota não especificada" },
  { code: "M15.0", description: "Osteoartrose primária generalizada" },
  { code: "M17.9", description: "Gonartrose não especificada" },
  { code: "M19.9", description: "Artrose não especificada" },
  { code: "M25.5", description: "Dor articular" },
  { code: "M51.1", description: "Hérnia de disco lombar com radiculopatia" },
  { code: "M54.2", description: "Cervicalgia" },
  { code: "M54.4", description: "Lumbago com ciática" },
  { code: "M54.5", description: "Dor lombar baixa" },
  { code: "M62.6", description: "Distensão muscular" },
  { code: "M75.1", description: "Síndrome do manguito rotador" },
  { code: "M79.1", description: "Mialgia" },
  { code: "M79.7", description: "Fibromialgia" },
  { code: "M81.9", description: "Osteoporose não especificada" },

  // Pele
  { code: "L20.9", description: "Dermatite atópica não especificada" },
  { code: "L23.9", description: "Dermatite alérgica de contato" },
  { code: "L29.9", description: "Prurido não especificado" },
  { code: "L30.9", description: "Dermatite não especificada" },
  { code: "L40.9", description: "Psoríase não especificada" },
  { code: "L50.9", description: "Urticária não especificada" },
  { code: "L70.0", description: "Acne vulgar" },
  { code: "L98.9", description: "Afecção da pele e tecido subcutâneo não esp." },

  // Neurológico
  { code: "G40.9", description: "Epilepsia não especificada" },
  { code: "G43.9", description: "Enxaqueca não especificada" },
  { code: "G44.2", description: "Cefaleia tensional" },
  { code: "G47.0", description: "Distúrbios do início e manutenção do sono (insônia)" },
  { code: "G47.30", description: "Apneia do sono não especificada" },
  { code: "G56.0", description: "Síndrome do túnel do carpo" },
  { code: "G62.9", description: "Polineuropatia não especificada" },
  { code: "R51", description: "Cefaleia" },

  // Mental
  { code: "F10.2", description: "Transtornos por uso de álcool (dependência)" },
  { code: "F17.2", description: "Dependência de tabaco" },
  { code: "F20.9", description: "Esquizofrenia não especificada" },
  { code: "F31.9", description: "Transtorno afetivo bipolar não especificado" },
  { code: "F32.0", description: "Episódio depressivo leve" },
  { code: "F32.1", description: "Episódio depressivo moderado" },
  { code: "F32.9", description: "Episódio depressivo não especificado" },
  { code: "F33.9", description: "Transtorno depressivo recorrente não especificado" },
  { code: "F41.0", description: "Transtorno de pânico" },
  { code: "F41.1", description: "Transtorno de ansiedade generalizada" },
  { code: "F41.2", description: "Transtorno misto ansioso e depressivo" },
  { code: "F43.0", description: "Reação aguda ao estresse" },
  { code: "F43.2", description: "Transtornos de adaptação" },
  { code: "F45.9", description: "Transtorno somatoforme não especificado" },
  { code: "F50.0", description: "Anorexia nervosa" },
  { code: "F51.0", description: "Insônia não orgânica" },

  // Olhos e ouvidos
  { code: "H10.9", description: "Conjuntivite não especificada" },
  { code: "H52.0", description: "Hipermetropia" },
  { code: "H52.1", description: "Miopia" },
  { code: "H52.2", description: "Astigmatismo" },
  { code: "H52.4", description: "Presbiopia" },
  { code: "H66.9", description: "Otite média não especificada" },
  { code: "H81.0", description: "Doença de Ménière" },
  { code: "H81.1", description: "Vertigem paroxística benigna" },
  { code: "H93.1", description: "Tinido" },

  // Hematologia
  { code: "D50.9", description: "Anemia por deficiência de ferro não especificada" },
  { code: "D64.9", description: "Anemia não especificada" },

  // Infecção / outros
  { code: "A09", description: "Diarreia e gastroenterite de origem infecciosa" },
  { code: "B19.9", description: "Hepatite viral não especificada" },
  { code: "B34.9", description: "Infecção viral não especificada" },
  { code: "B86", description: "Escabiose" },

  // Sintomas / R-codes
  { code: "R05", description: "Tosse" },
  { code: "R07.4", description: "Dor torácica não especificada" },
  { code: "R10.4", description: "Dor abdominal não especificada" },
  { code: "R11", description: "Náusea e vômitos" },
  { code: "R19.7", description: "Diarreia não especificada" },
  { code: "R42", description: "Tontura e instabilidade" },
  { code: "R50.9", description: "Febre não especificada" },
  { code: "R53", description: "Mal-estar e fadiga" },
  { code: "R60.0", description: "Edema localizado" },
  { code: "R63.4", description: "Perda anormal de peso" },

  // Z-codes (consultas, exames)
  { code: "Z00.0", description: "Exame médico geral" },
  { code: "Z01.4", description: "Exame ginecológico de rotina" },
  { code: "Z23.9", description: "Vacinação contra doença bacteriana não esp." },
  { code: "Z30.9", description: "Anticoncepção não especificada" },
  { code: "Z33", description: "Gravidez como achado casual" },
  { code: "Z34.9", description: "Supervisão de gravidez normal não especificada" },
  { code: "Z51.1", description: "Sessão de quimioterapia" },
  { code: "Z71.3", description: "Aconselhamento dietético" },
  { code: "Z76.5", description: "Pessoa que simula doença" },
];
