import React, { useEffect, useMemo, useState } from "react";
import AppShell from "@/layouts/AppShell";
import {
  listMovements,
  createMovement,
  updateMovement,
  deleteMovement,
} from "@/services/movements";
import type { Movement, MovementType } from "@/types/movement";
import { motion } from "framer-motion";

import DateTimelineFilter, { PresetKey, rangeForPreset } from "@/components/DateTimelineFilter";

// Helpers
const fmtMoney = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("es-AR");
const toISODate = (d: Date) => d.toISOString().slice(0, 10);

// Categorías base (las podés ajustar a gusto)
const DEFAULT_CATEGORIES = [
  "Sueldo",
  "Venta",
  "Alquiler",
  "Supermercado",
  "Internet",
  "Transporte",
  "Servicios",
  "Ocio",
  "Educación",
  "Salud",
  "Impuestos",
  "Otros"
];

export default function Transactions() {
  const [type, setType] = useState<"" | MovementType>("");
  const [category, setCategory] = useState(""); // filtro
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // timeline (por defecto: último mes)
  const [preset, setPreset] = useState<PresetKey>("last30");
  const [{ from, to }, setRange] = useState(() => rangeForPreset("last30"));
  function onPresetChange(p: PresetKey, r: { from: string; to: string }) {
    setPreset(p);
    setRange(r);
    setPage(1);
  }

  const [data, setData] = useState<Movement[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const pages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  // Modal/Edición
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Movement | null>(null);

  // Lista consolidada de categorías para selects
  const categories = useMemo(() => {
    const s = new Set<string>(DEFAULT_CATEGORIES);
    for (const m of data) s.add(m.category);
    if (editing?.category) s.add(editing.category);
    return Array.from(s).sort((a, b) => a.localeCompare(b, "es"));
  }, [data, editing]);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await listMovements({
        from, to,
        type: type || undefined,
        category: category || undefined,
        page, limit
      });
      setData(res.items);
      setTotal(res.total);
    } catch (e) {
      console.error(e);
      alert("No pude cargar movimientos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, type, category, page, limit]);

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(m: Movement) {
    setEditing(m);
    setOpen(true);
  }
  async function onDelete(id: string) {
    if (!confirm("¿Eliminar este movimiento?")) return;
    try {
      await deleteMovement(id);
      fetchList();
    } catch (e) {
      console.error(e);
      alert("No pude eliminar");
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    // Si el usuario eligió "Otra…" se toma el valor del input adicional
    const catSelected = String(fd.get("categorySelect") || "");
    const categoryFinal =
      catSelected === "__custom__"
        ? String(fd.get("categoryCustom") || "").trim()
        : catSelected;

    const payload = {
      type: (fd.get("type") as MovementType),
      amount: Number(fd.get("amount")),
      date: String(fd.get("date")),
      category: categoryFinal,
      note: String(fd.get("note") || "") || undefined
    };

    if (!payload.type || !payload.amount || !payload.date || !payload.category) {
      alert("Completá los campos requeridos");
      return;
    }

    setSaving(true);
    try {
      if (editing) await updateMovement(editing._id, payload);
      else await createMovement(payload);
      setOpen(false);
      fetchList();
    } catch (err) {
      console.error(err);
      alert("No pude guardar");
    } finally {
      setSaving(false);
    }
  }

  // Para el modal: si la categoría del registro no está en la lista, se agrega arriba en `categories`
  const initialCategory = editing?.category ?? "";

  return (
    <AppShell
      title={<>Transacciones</>}
      subtitle="Listado de movimientos con filtros, edición y borrado."
      actions={
        <button onClick={openCreate}
          className="rounded-xl border border-slate-700/80 bg-slate-900/40 px-4 py-2 text-sm text-slate-200 backdrop-blur transition hover:bg-slate-900/60">
          Nuevo movimiento
        </button>
      }
    >
      {/* Filtros */}
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-3 lg:col-span-3">
          <label className="block text-xs text-slate-400 mb-1">Rango de fechas</label>
          <DateTimelineFilter value={preset} onChange={onPresetChange} />
          <div className="mt-2 text-xs text-slate-500">{from} → {to}</div>
        </div>

        <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-3">
          <label className="block text-xs text-slate-400 mb-1">Tipo</label>
          <select className="w-full rounded-lg bg-slate-950/60 p-2" value={type}
            onChange={e => { setPage(1); setType(e.target.value as any); }}>
            <option value="">Todos</option>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
        </div>

        {/* Filtro: Categoría como desplegable */}
        <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-3">
          <label className="block text-xs text-slate-400 mb-1">Categoría</label>
          <select
            className="w-full rounded-lg bg-slate-950/60 p-2"
            value={category}
            onChange={e => { setPage(1); setCategory(e.target.value); }}
          >
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-2xl border border-slate-700/60 bg-slate-900/40">
        <table className="min-w-full text-sm">
          <thead className="text-slate-300">
            <tr className="border-b border-slate-700/60">
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Categoría</th>
              <th className="px-4 py-3 text-right">Monto</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">Cargando…</td></tr>
            )}
            {!loading && data.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">Sin movimientos</td></tr>
            )}
            {!loading && data.map((m) => (
              <motion.tr key={m._id}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="border-t border-slate-800/60">
                <td className="px-4 py-3">{fmtDate(m.date)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-lg px-2 py-1 text-xs ring-1 ${
                    m.type === "entrada"
                      ? "bg-emerald-500/10 text-emerald-300 ring-emerald-400/30"
                      : "bg-rose-500/10 text-rose-300 ring-rose-400/30"
                  }`}>{m.type}</span>
                </td>
                <td className="px-4 py-3 text-slate-200">{m.category}</td>
                <td className="px-4 py-3 text-right font-medium">
                  {m.type === "salida" ? "-" : ""}{fmtMoney.format(m.amount)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(m)}
                          className="mr-2 rounded-lg border border-slate-700/60 px-3 py-1 text-slate-200 hover:bg-slate-900/60">
                    Editar
                  </button>
                  <button onClick={() => onDelete(m._id)}
                          className="rounded-lg border border-rose-700/60 px-3 py-1 text-rose-300 hover:bg-rose-900/30">
                    Eliminar
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginador */}
      <div className="mt-4 flex items-center justify-end gap-3 text-sm text-slate-300">
        <span>Página {page} de {pages}</span>
        <button disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-700/60 px-3 py-1 disabled:opacity-40">
          Anterior
        </button>
        <button disabled={page >= pages}
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                className="rounded-lg border border-slate-700/60 px-3 py-1 disabled:opacity-40">
          Siguiente
        </button>
      </div>

      {/* Modal simple */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => !saving && setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-900/90 p-5 backdrop-blur"
               onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white">
              {editing ? "Editar movimiento" : "Nuevo movimiento"}
            </h3>

            <form className="mt-4 space-y-3" onSubmit={onSubmit}>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Tipo</label>
                <select name="type" defaultValue={editing?.type ?? "entrada"}
                        className="w-full rounded-lg bg-slate-950/60 p-2">
                  <option value="entrada">Entrada</option>
                  <option value="salida">Salida</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Monto</label>
                <input name="amount" type="number" min="0" step="0.01"
                       defaultValue={editing?.amount ?? ""} required
                       className="w-full rounded-lg bg-slate-950/60 p-2" />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Fecha</label>
                <input name="date" type="date"
                       defaultValue={editing ? toISODate(new Date(editing.date)) : toISODate(new Date())}
                       required className="w-full rounded-lg bg-slate-950/60 p-2" />
              </div>

              {/* Categoría con desplegable + "Otra…" */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Categoría</label>
                <select
                  name="categorySelect"
                  defaultValue={
                    initialCategory && categories.includes(initialCategory)
                      ? initialCategory
                      : ""
                  }
                  className="w-full rounded-lg bg-slate-950/60 p-2"
                  onChange={(e) => {
                    const wrap = e.currentTarget.closest("form")!;
                    const custom = wrap.querySelector<HTMLInputElement>('input[name="categoryCustom"]');
                    if (!custom) return;
                    if (e.currentTarget.value === "__custom__") {
                      custom.disabled = false;
                      custom.classList.remove("hidden");
                      custom.focus();
                    } else {
                      custom.value = "";
                      custom.disabled = true;
                      custom.classList.add("hidden");
                    }
                  }}
                >
                  <option value=""></option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="__custom__">Otra…</option>
                </select>
                <input
                  name="categoryCustom"
                  placeholder="Escribí la categoría"
                  disabled
                  className="mt-2 hidden w-full rounded-lg bg-slate-950/60 p-2"
                  defaultValue={
                    initialCategory && !categories.includes(initialCategory)
                      ? initialCategory
                      : ""
                  }
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Nota (opcional)</label>
                <input name="note" defaultValue={editing?.note ?? ""} 
                       className="w-full rounded-lg bg-slate-950/60 p-2" />
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button type="button" disabled={saving}
                        onClick={() => setOpen(false)}
                        className="rounded-lg border border-slate-700/60 px-4 py-2 text-slate-200">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                        className="rounded-lg border border-emerald-700/60 bg-emerald-500/10 px-4 py-2 text-emerald-200 hover:bg-emerald-500/20">
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
