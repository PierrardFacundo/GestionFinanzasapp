import 'dotenv/config';
import express from "express";
import cors from "cors";
import { connectMongo } from "./lib/mongo";

import movements from "./routes/movements";
import stats from "./routes/stats";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// ⬇️ Montar base /api, que es lo que espera tu frontend
app.use("/api/movements", movements);
app.use("/api/stats", stats);

// ⬇️ Healthcheck
app.get("/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

const PORT = Number(process.env.PORT || 4000);

async function main() {
  await connectMongo(process.env.MONGO_URI || "");
  console.log("MongoDB conectado");
  app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
}
main().catch(err => {
  console.error("Fallo al iniciar:", err);
  process.exit(1);
});
