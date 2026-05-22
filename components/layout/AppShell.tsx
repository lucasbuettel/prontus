import type { ReactNode } from "react";
import { getNavItemsForRole } from "./nav-items";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { BottomNav } from "./BottomNav";
import type { Profile } from "@/types/auth";

interface AppShellProps {
  profile: Profile;
  email: string;
  children: ReactNode;
}

export function AppShell({ profile, email, children }: AppShellProps) {
  const items = getNavItemsForRole(profile.role);

  return (
    <div className="flex min-h-dvh bg-background md:h-dvh">
      <Sidebar items={items} userEmail={email} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 md:overflow-y-auto">
          {children}
        </main>

        <BottomNav items={items} />
      </div>
    </div>
  );
}
