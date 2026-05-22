"use client";

import { useTransition, useState } from "react";
import { Check, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui";
import { approveUser, rejectUser, requeueUser } from "../actions";
import type { Profile } from "@/types/auth";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

interface UserRowProps {
  user: Profile;
}

export function UserRow({ user }: UserRowProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function runAction(
    action: typeof approveUser | typeof rejectUser | typeof requeueUser,
  ) {
    setError(null);
    startTransition(async () => {
      const result = await action({ userId: user.id });
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {user.full_name ?? "(sem nome)"}
        </p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Solicitado em {dateFormatter.format(new Date(user.created_at))}
        </p>
        {error && (
          <p role="alert" className="mt-2 text-xs text-danger">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {user.status === "PENDING" && (
          <>
            <Button
              variant="primary"
              size="sm"
              isLoading={isPending}
              onClick={() => runAction(approveUser)}
            >
              <Check className="h-4 w-4" aria-hidden />
              Aprovar
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isPending}
              onClick={() => runAction(rejectUser)}
            >
              <X className="h-4 w-4" aria-hidden />
              Rejeitar
            </Button>
          </>
        )}

        {user.status === "APPROVED" && (
          <Button
            variant="danger"
            size="sm"
            isLoading={isPending}
            onClick={() => runAction(rejectUser)}
          >
            <X className="h-4 w-4" aria-hidden />
            Revogar acesso
          </Button>
        )}

        {user.status === "REJECTED" && (
          <Button
            variant="secondary"
            size="sm"
            isLoading={isPending}
            onClick={() => runAction(requeueUser)}
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Voltar para pendente
          </Button>
        )}
      </div>
    </li>
  );
}
