import dotenv from "dotenv";
import { Secret } from "jsonwebtoken";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? ("change_me" as Secret),
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "7d",
};
