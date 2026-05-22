"use client";

import { Users, UserCheck } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import type { NavIconKey } from "./nav-items";

const ICONS: Record<NavIconKey, ComponentType<SVGProps<SVGSVGElement>>> = {
  patients: Users,
  admin: UserCheck,
};

interface NavIconProps extends SVGProps<SVGSVGElement> {
  name: NavIconKey;
}

export function NavIcon({ name, ...rest }: NavIconProps) {
  const Icon = ICONS[name];
  return <Icon {...rest} />;
}
