import type { UserRole } from "@/types/auth";

export type NavIconKey = "patients" | "admin";

export interface NavItem {
  href: string;
  label: string;
  icon: NavIconKey;
  roles?: UserRole[];
}

const ALL_NAV_ITEMS: NavItem[] = [
  { href: "/patients", label: "Pacientes", icon: "patients" },
  { href: "/admin/users", label: "Admin", icon: "admin", roles: ["SUPERADMIN"] },
];

export function getNavItemsForRole(role: UserRole): NavItem[] {
  return ALL_NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(role));
}
