import { Router } from "express";
import { z } from "zod";
import { Movement } from "../models/movement";

const r = Router();

/** Serie acumulada para el gráfico de evolución (ingresos - gastos) */
const seriesQuery = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});

r.get("/balance-series", async (req, res, next) => {
  try {
    const q = seriesQuery.parse(req.query);
    const end = q.to ? new Date(q.to) : new Date();
    const start = q.from ? new Date(q.from) : new Date(end.getTime() - 180 * 24 * 3600 * 1000);

    const docs = await Movement.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      {
        $project: {
          day: { $dateTrunc: { date: "$date", unit: "day" } },
          signed: { $cond: [{ $eq: ["$type", "entrada"] }, "$amount", { $multiply: ["$amount", -1] }] },
        },
      },
      { $group: { _id: "$day", delta: { $sum: "$signed" } } },
      { $sort: { _id: 1 } },
    ]);

    let acc = 0;
    const series = docs.map((d) => {
      acc += d.delta;
      return { date: d._id, delta: d.delta, balance: acc };
    });

    res.json({ start, end, series });
  } catch (err) {
    next(err);
  }
});

/** Torta: gastos por categoría del mes indicado (default: mes actual) */
const pieQuery = z.object({
  year: z.coerce.number().optional(),
  month: z.coerce.number().min(1).max(12).optional(), // 1..12
});

r.get("/expenses-by-category", async (req, res, next) => {
  try {
    const now = new Date();
    const q = pieQuery.parse(req.query);
    const year = q.year ?? now.getFullYear();
    const month = q.month ?? now.getMonth() + 1; // 1..12

    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));

    const rows = await Movement.aggregate([
      { $match: { type: "salida", date: { $gte: start, $lt: end } } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
    ]);

    const total = rows.reduce((s, r) => s + r.total, 0) || 1;
    const data = rows.map((r) => ({ category: r._id, total: r.total, pct: r.total / total }));

    res.json({ year, month, total, data });
  } catch (err) {
    next(err);
  }
});

/** Resumen global para KPIs: ingresos, gastos, balance neto */
r.get("/summary", async (_req, res, next) => {
  try {
    const rows = await Movement.aggregate([{ $group: { _id: "$type", total: { $sum: "$amount" } } }]);
    const ingresos = rows.find((r) => r._id === "entrada")?.total ?? 0;
    const gastos = rows.find((r) => r._id === "salida")?.total ?? 0;
    res.json({ ingresos, gastos, balance: ingresos - gastos });
  } catch (err) {
    next(err);
  }
});

export default r;
