"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { SignOutButton } from "@/features/auth/components/SignOutButton";
import { NavIcon } from "./nav-icons";
import type { NavItem } from "./nav-items";

interface SidebarProps {
  items: NavItem[];
  userEmail: string;
}

export function Sidebar({ items, userEmail }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-border md:bg-surface">
      <div className="flex h-14 items-center border-b border-border px-5">
        <span className="text-base font-semibold tracking-tight text-foreground">
          Prontus
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {items.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-surface-muted",
              )}
            >
              <NavIcon name={item.icon} className="h-4 w-4" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <p className="mb-2 truncate px-1 text-xs text-muted-foreground">
          {userEmail}
        </p>
        <SignOutButton />
      </div>
    </aside>
  );
}
