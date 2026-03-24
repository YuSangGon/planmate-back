import type { JwtPayload } from "./auth";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      role: string;
    }

    interface Request {
      auth?: JwtPayload;
      user?: UserPayload;
    }
  }
}

export {};
