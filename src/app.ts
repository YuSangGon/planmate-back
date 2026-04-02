import express from "express";
import cors from "cors";
import routes from "./routes";
import { env } from "./config/env";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { prisma } from "./lib/prisma";
import { initSocketServer } from "./lib/socket";

const app = express();
const origin = process.env.CORS_ORIGIN;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  origin,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },
    credentials: true,
  }),
);

app.options("*", cors());

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    data: {
      message: "PlanMate backend is running",
    },
  });
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});

initSocketServer(server);

async function shutdown() {
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
