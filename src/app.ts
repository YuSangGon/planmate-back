import express from "express";
import cors from "cors";
import routes from "./routes";
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
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (requestOrigin, callback) => {
      if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

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

const port = Number(process.env.PORT || 4000);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
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
