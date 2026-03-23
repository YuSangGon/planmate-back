import { getUserById } from "./auth.service";

export async function getCurrentUser(userId: string) {
  return getUserById(userId);
}
