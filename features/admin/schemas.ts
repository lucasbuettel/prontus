import { z } from "zod";
import { USER_STATUSES } from "@/types/auth";

export const userIdSchema = z.object({
  userId: z.string().uuid("ID de usuário inválido"),
});
export type UserIdInput = z.infer<typeof userIdSchema>;

export const userStatusFilterSchema = z.enum(USER_STATUSES);
export type UserStatusFilter = z.infer<typeof userStatusFilterSchema>;
