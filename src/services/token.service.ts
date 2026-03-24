import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import type { JwtPayload } from "../types/auth";

export function signAccessToken(payload: JwtPayload): string {
  console.log(env.jwtAccessSecret);
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn,
  } as SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtAccessSecret) as JwtPayload;
}
