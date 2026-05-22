import { EmptyState } from "@/components/ui";
import { StatusTabs } from "./StatusTabs";
import { UserRow } from "./UserRow";
import type { Profile, UserStatus } from "@/types/auth";

interface UsersAdminViewProps {
  users: Profile[];
  currentStatus: UserStatus;
  counts: Record<UserStatus, number>;
}

const EMPTY_COPY: Record<UserStatus, { title: string; description: string }> = {
  PENDING: {
    title: "Nenhum cadastro pendente",
    description: "Quando alguém solicitar acesso, vai aparecer aqui.",
  },
  APPROVED: {
    title: "Nenhum usuário aprovado ainda",
    description: "Aprove uma solicitação pendente para começar.",
  },
  REJECTED: {
    title: "Nenhum cadastro rejeitado",
    description: "Solicitações rejeitadas aparecem aqui.",
  },
};

export function UsersAdminView({
  users,
  currentStatus,
  counts,
}: UsersAdminViewProps) {
  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Usuários
        </h1>
        <p className="text-sm text-muted-foreground">
          Aprove ou rejeite solicitações de acesso ao Prontus.
        </p>
      </header>

      <StatusTabs current={currentStatus} counts={counts} />

      {users.length === 0 ? (
        <EmptyState {...EMPTY_COPY[currentStatus]} />
      ) : (
        <ul className="flex flex-col gap-2">
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </ul>
      )}
    </section>
  );
}
