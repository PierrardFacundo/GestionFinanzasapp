import { Router } from "express";
import { z } from "zod";
import { Movement } from "../models/movement";

const r = Router();

const baseSchema = z.object({
  type: z.enum(["entrada", "salida"]),
  amount: z.number().positive(),
  date: z.union([z.string(), z.date()]),
  category: z.string().min(1),
  note: z.string().max(280).optional(),
});

// Crear
r.post("/", async (req, res, next) => {
  try {
    const body = baseSchema.parse(req.body);
    const doc = await Movement.create({ ...body, date: new Date(body.date as any) });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
});

// Listar con filtros + paginación
const listQuery = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  type: z.enum(["entrada", "salida"]).optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

r.get("/", async (req, res, next) => {
  try {
    const q = listQuery.parse(req.query);
    const filter: any = {};
    if (q.type) filter.type = q.type;
    if (q.category) filter.category = q.category;
    if (q.from || q.to) {
      filter.date = {};
      if (q.from) filter.date.$gte = new Date(q.from);
      if (q.to) filter.date.$lte = new Date(q.to);
    }
    const skip = (q.page - 1) * q.limit;

    const [items, total] = await Promise.all([
      Movement.find(filter).sort({ date: -1, _id: -1 }).skip(skip).limit(q.limit).lean(),
      Movement.countDocuments(filter),
    ]);

    res.json({ items, total, page: q.page, limit: q.limit });
  } catch (err) {
    next(err);
  }
});

// Editar
const idParam = z.object({ id: z.string().length(24) });

r.patch("/:id", async (req, res, next) => {
  try {
    const { id } = idParam.parse(req.params);
    const patch = baseSchema.partial().parse(req.body);
    if (patch.date) (patch as any).date = new Date(patch.date as any);
    const updated = await Movement.findByIdAndUpdate(id, patch, { new: true });
    if (!updated) return res.status(404).json({ error: "not_found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Eliminar
r.delete("/:id", async (req, res, next) => {
  try {
    const { id } = idParam.parse(req.params);
    const del = await Movement.findByIdAndDelete(id);
    if (!del) return res.status(404).json({ error: "not_found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default r;

