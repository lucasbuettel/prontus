"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui";
import { signOut } from "../actions";

export function SignOutButton({
  label = "Sair",
  variant = "ghost",
}: {
  label?: string;
  variant?: "ghost" | "secondary" | "danger";
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      isLoading={isPending}
      onClick={() => startTransition(() => signOut())}
    >
      <LogOut className="h-4 w-4" aria-hidden />
      {label}
    </Button>
  );
}
