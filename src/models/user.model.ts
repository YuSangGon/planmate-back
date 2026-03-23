import type { UserRole } from "../types/api";

export type UserModel = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  bio?: string;
  createdAt: string;
  updatedAt: string;
};
