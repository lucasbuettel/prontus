# Prontus

Sistema clínico **mobile first** para registro de pacientes, consultas e evolução clínica.
Construído com Next.js (App Router), TypeScript e Tailwind CSS, com backend e autenticação em Supabase.

> Esta branch (`demo-fast`) é uma versão acelerada e demonstrável. A branch principal de aprendizado será desenvolvida passo a passo em paralelo.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** estrito
- **Tailwind CSS v4** (com tokens via `@theme`)
- **Supabase** (Postgres + Auth + RLS)
- **react-hook-form** + **zod** para formulários type-safe
- **date-fns** (locale pt-BR) para cálculos e formatação de datas
- **Vitest** + **Testing Library** para testes
- **lucide-react** para ícones

## Funcionalidades planejadas

- Autenticação (email/senha + Google) com fluxo de aprovação manual.
- Permissões por role (SUPERADMIN / DOCTOR) e status (PENDING / APPROVED / REJECTED).
- CRUD de pacientes com busca por nome/prontuário.
- Consultas com estrutura SOAP (primeira consulta + retorno).
- Prescrição médica com itens editáveis antes de salvar.
- Exames complementares (lista comum + campo livre).
- Histórico clínico do paciente com timeline.
- Layout privado mobile first.

## Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com as chaves do seu projeto Supabase

# 3. Subir o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

Ver [`.env.example`](./.env.example) para a lista completa. Resumo:

| Variável | Onde é usada | Notas |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | Pública |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server | Pública, protegida por RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Bypassa RLS — nunca expor ao client |

## Cuidados com dados sensíveis

- Dados clínicos são confidenciais. Toda demonstração usa **dados fictícios** (seed/demo).
- Row Level Security (RLS) está habilitado em todas as tabelas. Nenhuma policy "permissiva universal" é usada.
- Sessão é mantida via cookies httpOnly (padrão `@supabase/ssr`), nunca em `localStorage`.
- `SUPABASE_SERVICE_ROLE_KEY` é usada apenas em server actions específicas (ex: aprovação de usuários) e nunca vaza ao bundle do client.
- Nada de dados reais em commits, prints ou issues.

## Próximos passos

- Migração do schema para uma instância de Postgres própria (Neon/Railway/RDS) quando o demo amadurecer.
- Importação completa da RENAME para o catálogo de medicações.
- Geração de PDF da prescrição e do prontuário.
- Logs de auditoria por usuário.

## Estrutura

```
app/
  (auth)/          # rotas públicas (login, register-request, etc.)
  (private)/       # rotas protegidas por middleware
components/
  ui/              # design system (Button, Input, Card, Field, ...)
features/          # regras de negócio por domínio (auth, patients, ...)
lib/               # utilitários compartilhados (cn, supabase clients)
constants/         # listas fixas (medicações comuns, exames, ...)
types/             # tipos compartilhados (DB, domínio)
```
