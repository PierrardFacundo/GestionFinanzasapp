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

r.get("/expenses-monthly-by-category", async (req, res, next) => {
  try {
    const q = z.object({ from: z.string().optional(), to: z.string().optional() }).parse(req.query);

    // Filtro base
    const match: any = { type: "salida" };
    if (q.from || q.to) {
      match.date = {};
      if (q.from) match.date.$gte = new Date(q.from);
      if (q.to) {
        const d = new Date(q.to);
        d.setHours(23, 59, 59, 999);
        match.date.$lte = d;
      }
    }

    const rows = await Movement.aggregate([
      { $match: match },
      {
        $group: {
          _id: { y: { $year: "$date" }, m: { $month: "$date" }, c: "$category" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1, "_id.c": 1 } },
    ]);

    // Respuesta plana: un item por (año, mes, categoría)
    const data = rows.map((r) => ({
      year: r._id.y,
      month: r._id.m,
      category: r._id.c,
      total: r.total,
    }));

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

/** Gastos por mes dentro de un rango (type = "salida") */
r.get("/expenses-monthly", async (req, res, next) => {
  try {
    const q = z.object({ from: z.string().optional(), to: z.string().optional() }).parse(req.query);

    // Armo el match por tipo y rango
    const match: any = { type: "salida" };
    if (q.from || q.to) {
      match.date = {};
      if (q.from) match.date.$gte = new Date(q.from);
      if (q.to) {
        const d = new Date(q.to);
        d.setHours(23, 59, 59, 999);
        match.date.$lte = d;
      }
    }

    const rows = await Movement.aggregate([
      { $match: match },
      {
        $group: {
          _id: { y: { $year: "$date" }, m: { $month: "$date" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1 } },
    ]);

    // Normalizamos meses faltantes con 0 si vienen from/to
    function* monthsBetween(a: Date, b: Date) {
      const d = new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), 1));
      const end = new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), 1));
      while (d <= end) {
        yield { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1 };
        d.setUTCMonth(d.getUTCMonth() + 1);
      }
    }

    let data: { year: number; month: number; total: number }[] = [];
    if (q.from && q.to) {
      const byKey = new Map<string, number>();
      for (const r of rows) byKey.set(`${r._id.y}-${r._id.m}`, r.total);
      const from = new Date(q.from);
      const to = new Date(q.to);
      for (const mm of monthsBetween(from, to)) {
        const key = `${mm.y}-${mm.m}`;
        data.push({ year: mm.y, month: mm.m, total: byKey.get(key) ?? 0 });
      }
    } else {
      data = rows.map((r) => ({ year: r._id.y, month: r._id.m, total: r.total }));
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});


export default r;
