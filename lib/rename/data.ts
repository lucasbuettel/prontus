/**
 * RENAME — Relação Nacional de Medicamentos Essenciais (subset).
 *
 * Esta lista é intencionalmente pequena (~100 medicamentos comuns em
 * atenção ambulatorial). A RENAME completa do MS tem ~900 itens. Pra
 * expandir, copie da publicação oficial:
 * https://www.gov.br/saude/pt-br/composicao/sctie/daf/rename
 *
 * Mantenha o shape { name } — o componente DrugAutocomplete lida com
 * qualquer tamanho de lista. Texto livre também é permitido.
 */
export interface DrugEntry {
  name: string;
}

const NAMES: string[] = [
  // Analgésicos e antitérmicos
  "Dipirona sódica 500 mg",
  "Paracetamol 500 mg",
  "Paracetamol 750 mg",
  "Ácido acetilsalicílico 100 mg",
  "Ácido acetilsalicílico 500 mg",

  // AINEs
  "Ibuprofeno 400 mg",
  "Ibuprofeno 600 mg",
  "Naproxeno 500 mg",
  "Diclofenaco sódico 50 mg",
  "Diclofenaco potássico 50 mg",
  "Cetoprofeno 100 mg",
  "Meloxicam 15 mg",
  "Nimesulida 100 mg",

  // Antibióticos
  "Amoxicilina 500 mg",
  "Amoxicilina + clavulanato 875/125 mg",
  "Azitromicina 500 mg",
  "Cefalexina 500 mg",
  "Ciprofloxacino 500 mg",
  "Doxiciclina 100 mg",
  "Levofloxacino 500 mg",
  "Metronidazol 250 mg",
  "Metronidazol 400 mg",
  "Nitrofurantoína 100 mg",
  "Sulfametoxazol + trimetoprima 800/160 mg",

  // Antifúngicos / antivirais
  "Fluconazol 150 mg",
  "Itraconazol 100 mg",
  "Aciclovir 200 mg",
  "Aciclovir 400 mg",

  // Anti-hipertensivos
  "Losartana potássica 50 mg",
  "Losartana potássica 100 mg",
  "Enalapril maleato 10 mg",
  "Enalapril maleato 20 mg",
  "Captopril 25 mg",
  "Anlodipino 5 mg",
  "Anlodipino 10 mg",
  "Atenolol 25 mg",
  "Atenolol 50 mg",
  "Propranolol 40 mg",
  "Carvedilol 6,25 mg",
  "Carvedilol 25 mg",
  "Metoprolol succinato 50 mg",
  "Hidroclorotiazida 25 mg",
  "Furosemida 40 mg",
  "Espironolactona 25 mg",
  "Espironolactona 100 mg",

  // Diabetes
  "Metformina 500 mg",
  "Metformina 850 mg",
  "Metformina 1000 mg",
  "Glibenclamida 5 mg",
  "Gliclazida 30 mg MR",
  "Empagliflozina 10 mg",
  "Empagliflozina 25 mg",
  "Insulina NPH humana 100 UI/mL",
  "Insulina regular humana 100 UI/mL",

  // Dislipidemia
  "Sinvastatina 20 mg",
  "Sinvastatina 40 mg",
  "Atorvastatina 20 mg",
  "Atorvastatina 40 mg",
  "Rosuvastatina 10 mg",
  "Rosuvastatina 20 mg",
  "Ezetimiba 10 mg",

  // Trato gastrointestinal
  "Omeprazol 20 mg",
  "Pantoprazol 40 mg",
  "Esomeprazol 40 mg",
  "Ranitidina 150 mg",
  "Bromoprida 10 mg",
  "Metoclopramida 10 mg",
  "Domperidona 10 mg",
  "Hioscina 10 mg",
  "Hioscina + dipirona",
  "Loperamida 2 mg",
  "Simeticona 40 mg",

  // Trato respiratório / alergias
  "Loratadina 10 mg",
  "Desloratadina 5 mg",
  "Cetirizina 10 mg",
  "Fexofenadina 120 mg",
  "Salbutamol spray 100 mcg",
  "Budesonida inalatória 200 mcg",
  "Beclometasona inalatória 250 mcg",
  "Formoterol + budesonida 6/200 mcg",
  "Prednisona 5 mg",
  "Prednisona 20 mg",
  "Prednisolona 5 mg/mL",
  "Dexametasona 4 mg",

  // Saúde mental
  "Sertralina 50 mg",
  "Sertralina 100 mg",
  "Fluoxetina 20 mg",
  "Escitalopram 10 mg",
  "Escitalopram 20 mg",
  "Citalopram 20 mg",
  "Venlafaxina 75 mg",
  "Duloxetina 30 mg",
  "Amitriptilina 25 mg",
  "Nortriptilina 25 mg",
  "Clonazepam 2 mg",
  "Diazepam 5 mg",
  "Diazepam 10 mg",
  "Zolpidem 10 mg",
  "Alprazolam 0,5 mg",
  "Bupropiona 150 mg",

  // Tireoide
  "Levotiroxina sódica 25 mcg",
  "Levotiroxina sódica 50 mcg",
  "Levotiroxina sódica 75 mcg",
  "Levotiroxina sódica 100 mcg",

  // Anticoagulantes / antiagregantes
  "Clopidogrel 75 mg",
  "Varfarina sódica 5 mg",
  "Rivaroxabana 20 mg",
  "Apixabana 5 mg",

  // Vitaminas / suplementos
  "Vitamina D3 7000 UI",
  "Vitamina D3 50000 UI",
  "Sulfato ferroso 40 mg de ferro",
  "Ácido fólico 5 mg",
  "Complexo B",
  "Cianocobalamina 5000 mcg",
];

export const RENAME: DrugEntry[] = NAMES.map((name) => ({ name }));
