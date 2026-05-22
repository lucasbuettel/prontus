export const USER_ROLES = ["SUPERADMIN", "DOCTOR"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}
