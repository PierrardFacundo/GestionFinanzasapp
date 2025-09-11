import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight, PiggyBank, Wallet, LineChart as LineIcon } from "lucide-react";
import AppShell from "@/layouts/AppShell";
import { Card, Stat } from "@/components/ui/card";
import { motion } from "framer-motion";

import {
  getSummary,
  getBalanceSeries,
  getExpensesByCategory,
} from "@/services/movements";
import type { BalanceSeries, ExpensesByCategory } from "@/types/movement";

import DateTimelineFilter, { PresetKey, rangeForPreset } from "@/components/DateTimelineFilter";

// ===== Helpers
const fmtMoney = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
const monthLabel = (y: number, m: number) =>
  new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("es-AR", { year: "numeric", month: "long" });

// ===== Página
export default function Dashboard() {
  const nav = useNavigate();

  // timeline (por defecto: últimos 6 meses)
  const [preset, setPreset] = useState<PresetKey>("last180");
  const [{ from, to }, setRange] = useState(() => rangeForPreset("last180"));

  // data
  const [summary, setSummary] = useState<{ ingresos: number; gastos: number; balance: number } | null>(null);
  const [series, setSeries] = useState<BalanceSeries | null>(null);
  const [pie, setPie] = useState<ExpensesByCategory | null>(null);

  // loading
  const [loading, setLoading] = useState(true);

  function onPresetChange(p: PresetKey, r: { from: string; to: string }) {
    setPreset(p);
    setRange(r);
  }

  async function fetchAll() {
    setLoading(true);
    try {
      // para la torta usamos el mes del límite superior (to)
      const toDate = new Date(to);
      const year = toDate.getFullYear();
      const month = toDate.getMonth() + 1;

      const [s, b, p] = await Promise.all([
        getSummary(),
        getBalanceSeries({ from, to }),
        getExpensesByCategory({ year, month }),
      ]);
      setSummary(s);
      setSeries(b);
      setPie(p);
    } catch (e) {
      console.error(e);
      alert("No pude cargar datos del dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [from, to]);

  // etiquetas auxiliares
  const toDate = new Date(to);
  const y = toDate.getFullYear();
  const m = toDate.getMonth() + 1;

  return (
    <AppShell
      title={
        <>
          Tu panorama financiero
          <span className="ml-2 rounded-lg bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/30">
            Dashboard
          </span>
        </>
      }
      subtitle="Resumen de balances, movimientos y metas en un solo lugar."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => nav("/transacciones")}
            className="rounded-xl border border-slate-700/80 bg-slate-900/40 px-4 py-2 text-sm text-slate-200 backdrop-blur transition hover:bg-slate-900/60"
          >
            Agregar movimiento
          </button>
        </div>
      }
    >
      {/* Timeline de rango */}
      <div className="mb-4 rounded-xl border border-slate-700/60 bg-slate-900/40 p-3">
        <label className="mb-2 block text-xs text-slate-400">Rango de fechas</label>
        <DateTimelineFilter value={preset} onChange={onPresetChange} />
        <p className="mt-2 text-xs text-slate-500">
          Mostrando <b>{from}</b> → <b>{to}</b>
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <Stat label="Balance" value={summary ? fmtMoney.format(summary.balance) : "—"} hint={`Hasta ${monthLabel(y, m)}`} />
            <span className="grid h-10 w-10 place-content-center rounded-xl bg-emerald-500/10 text-emerald-300">
              <Wallet className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <Stat
              label="Ingresos"
              value={
                <div className="flex items-center gap-2">
                  {summary ? fmtMoney.format(summary.ingresos) : "—"} <ArrowUpRight className="h-4 w-4" />
                </div>
              }
              hint={`Hasta ${monthLabel(y, m)}`}
            />
            <span className="grid h-10 w-10 place-content-center rounded-xl bg-emerald-500/10 text-emerald-300">
              <PiggyBank className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <Stat
              label="Gastos"
              value={
                <div className="flex items-center gap-2">
                  {summary ? fmtMoney.format(summary.gastos) : "—"} <ArrowDownRight className="h-4 w-4" />
                </div>
              }
              hint={`Hasta ${monthLabel(y, m)}`}
            />
            <span className="grid h-10 w-10 place-content-center rounded-xl bg-emerald-500/10 text-emerald-300">
              <LineIcon className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <Stat label="Periodo" value="Según timeline" hint={`${from} → ${to}`} />
            <span className="grid h-10 w-10 place-content-center rounded-xl bg-emerald-500/10 text-emerald-300">
              <LineIcon className="h-5 w-5" />
            </span>
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-slate-300">Evolución de balance</div>
            <div className="text-xs text-slate-400">{from} → {to}</div>
          </div>
          <div className="h-40">
            {loading ? (
              <div className="grid h-full place-content-center text-slate-400 text-sm">Cargando…</div>
            ) : series && series.series.length > 0 ? (
              <MiniAreaChart data={series} />
            ) : (
              <div className="grid h-full place-content-center text-slate-400 text-sm">Sin datos</div>
            )}
          </div>
        </Card>

        <Card>
          <div className="mb-3 text-sm text-slate-300">Gastos por categoría ({monthLabel(y, m)})</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-center">
              {loading ? (
                <div className="text-slate-400 text-sm">Cargando…</div>
              ) : pie && pie.data.length > 0 ? (
                <DonutChart total={pie.total} data={pie.data} />
              ) : (
                <div className="text-slate-400 text-sm">Sin gastos</div>
              )}
            </div>
            {/* leyenda */}
            <ul className="space-y-2 text-sm">
              {(pie?.data ?? []).map((s, i) => (
                <li key={s.category} className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-950/60 px-3 py-2">
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: sliceColor(i) }} />
                    <span className="text-slate-200">{s.category}</span>
                  </span>
                  <span className="text-slate-400">{Math.round(s.pct * 100)}%</span>
                  <span className="font-medium text-white">{fmtMoney.format(s.total)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

// ===== Charts (SVG puros, sin librerías)
function MiniAreaChart({ data }: { data: BalanceSeries }) {
  const width = 320, height = 140, pad = 8;
  const points = data.series;

  const balances = points.map(p => p.balance);
  let minY = Math.min(0, ...balances);
  let maxY = Math.max(0, ...balances);
  if (minY === maxY) { minY -= 1; maxY += 1; }

  const x = (i: number) => {
    if (points.length === 1) return width / 2;
    return (i / (points.length - 1)) * (width - pad * 2) + pad;
  };
  const y = (v: number) => {
    const t = (v - minY) / (maxY - minY);
    return height - (t * (height - pad * 2) + pad);
  };

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)},${y(p.balance)}`).join(" ");
  const area = `${line} L ${width - pad},${height - pad} L ${pad},${height - pad} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-40 w-full">
      <defs>
        <linearGradient id="fillGradDash" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(16,185,129,0.55)" />
          <stop offset="100%" stopColor="rgba(16,185,129,0.0)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#fillGradDash)" />
      <path d={line} stroke="rgb(52,211,153)" strokeWidth="3" fill="none" />
      <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="rgba(148,163,184,0.25)" />
    </svg>
  );
}

function DonutChart({ total, data }: { total: number; data: ExpensesByCategory["data"] }) {
  const r = 38;
  const cx = 44, cy = 44;
  const w = 16; // stroke width
  const C = 2 * Math.PI * r;
  let acc = 0;

  return (
    <svg viewBox="0 0 88 88" className="h-28 w-28">
      {/* base */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth={w} />
      {data.map((s, i) => {
        const frac = s.pct || (total ? s.total / total : 0);
        const len = Math.max(0.001, frac * C);
        const dash = `${len} ${C - len}`;
        const offset = -acc * C; // arranca arriba
        acc += frac;
        return (
          <circle
            key={s.category}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={sliceColor(i)}
            strokeWidth={w}
            strokeDasharray={dash}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            strokeLinecap="butt"
          />
        );
      })}
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="text-[9px] fill-white">
        {fmtMoney.format(total)}
      </text>
    </svg>
  );
}

// paleta para la torta
function sliceColor(i: number) {
  const colors = [
    "#34d399", "#22d3ee", "#60a5fa", "#c4b5fd", "#fbbf24",
    "#f472b6", "#fb7185", "#a3e635", "#38bdf8", "#f59e0b",
  ];
  return colors[i % colors.length];
}
