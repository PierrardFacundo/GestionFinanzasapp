import 'dotenv/config';
import express from "express";
import cors from "cors";
import { connectMongo } from "./lib/mongo";

// 👇 nuevas rutas
import movements from "./routes/movements";
import stats from "./routes/stats";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Healthcheck
app.get("/health", (_req, res) =>
  res.json({ ok: true, service: "backend", env: process.env.NODE_ENV || "dev" })
);

// 👇 monta API
app.use("/api/movements", movements);
app.use("/api/stats", stats);

const PORT = Number(process.env.PORT || 4000);

async function main() {
  await connectMongo(process.env.MONGO_URI || "");
  app.listen(PORT, () => {
    console.log(`API escuchando en http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Fallo al iniciar:", err);
  process.exit(1);
});

