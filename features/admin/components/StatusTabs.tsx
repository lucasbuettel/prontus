import Link from "next/link";
import { cn } from "@/lib/cn";
import type { UserStatus } from "@/types/auth";

interface StatusTabsProps {
  current: UserStatus;
  counts: Record<UserStatus, number>;
}

const TABS: { status: UserStatus; label: string }[] = [
  { status: "PENDING", label: "Pendentes" },
  { status: "APPROVED", label: "Aprovados" },
  { status: "REJECTED", label: "Rejeitados" },
];

export function StatusTabs({ current, counts }: StatusTabsProps) {
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border">
      {TABS.map((tab) => {
        const isActive = tab.status === current;
        return (
          <Link
            key={tab.status}
            href={`/admin/users?status=${tab.status}`}
            className={cn(
              "flex shrink-0 items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "bg-surface-muted text-muted-foreground",
              )}
            >
              {counts[tab.status]}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
