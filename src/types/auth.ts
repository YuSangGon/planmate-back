import type { UserRole } from "./api";

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
};
