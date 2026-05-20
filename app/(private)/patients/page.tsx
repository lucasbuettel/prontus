import { EmptyState } from "@/components/ui";

export default function PatientsPage() {
  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Pacientes
        </h1>
        <p className="text-sm text-muted-foreground">
          Listagem, busca e cadastro de pacientes.
        </p>
      </header>

      <EmptyState
        title="Lista de pacientes em construção"
        description="A listagem completa será implementada na Fase 3."
      />
    </section>
  );
}
