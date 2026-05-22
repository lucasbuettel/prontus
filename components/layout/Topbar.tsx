import { SignOutButton } from "@/features/auth/components/SignOutButton";

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-surface px-4 md:hidden">
      <span className="text-base font-semibold tracking-tight text-foreground">
        Prontus
      </span>
      <SignOutButton />
    </header>
  );
}
