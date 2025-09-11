import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight, PiggyBank, Wallet, LineChart as LineIcon } from "lucide-react";
import AppShell from "@/layouts/AppShell";
import { Card, Stat } from "@/components/ui/card";
import { motion } from "framer-motion";

import {
  getSummary,
  getBalanceSeries,
  getExpensesByCategory,
  getExpensesMonthlyByCategory,
} from "@/services/movements";
import type { BalanceSeries, ExpensesByCategory } from "@/types/movement";

import DateTimelineFilter, { PresetKey, rangeForPreset } from "@/components/DateTimelineFilter";

// ===== Helpers
const fmtMoney = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
const monthLabel = (y: number, m: number) =>
  new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("es-AR", { year: "numeric", month: "long" });

// paleta fija
function colorFor(i: number) {
  const colors = [
    "#34d399", "#22d3ee", "#60a5fa", "#c4b5fd", "#fbbf24",
    "#f472b6", "#fb7185", "#a3e635", "#38bdf8", "#f59e0b",
    "#fca5a5", "#86efac", "#93c5fd"
  ];
  return colors[i % colors.length];
}

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

  // mensual por categoría (crudo del API)
  const [rawMonthlyCat, setRawMonthlyCat] = useState<{ year: number; month: number; category: string; total: number }[] | null>(null);

  // loading
  const [loading, setLoading] = useState(true);

  async function fetchAll() {
    setLoading(true);
    try {
      // para la leyenda de KPIs
      const toDate = new Date(to);
      const year = toDate.getFullYear();
      const month = toDate.getMonth() + 1;

      const [s, b, p, rows] = await Promise.all([
        getSummary(),
        getBalanceSeries({ from, to }),
        getExpensesByCategory({ year, month }),
        getExpensesMonthlyByCategory({ from, to }),
      ]);

      setSummary(s);
      setSeries(b);
      setPie(p);
      setRawMonthlyCat(rows.data);
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

  // ====== Transformación a estructura apilada: meses x categorías
  // Top 7 categorías del rango por total; el resto va a "Otros"
  const stacked = useMemo(() => {
    if (!rawMonthlyCat) return null;

    // meses presentes en el rango, ordenados
    const keyMonth = (y: number, m: number) => `${y}-${m.toString().padStart(2, "0")}`;
    const monthsSorted = Array.from(
      new Set(rawMonthlyCat.map(r => keyMonth(r.year, r.month)))
    ).sort((a, b) => a.localeCompare(b, "es")).map(k => {
      const [yy, mm] = k.split("-").map(Number);
      return { year: yy, month: mm };
    });

    // totales por categoría en el rango
    const totalByCat = new Map<string, number>();
    for (const r of rawMonthlyCat) {
      totalByCat.set(r.category, (totalByCat.get(r.category) ?? 0) + r.total);
    }

    const catsSorted = Array.from(totalByCat.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([c]) => c);

    const TOP = 7;
    const topCats = catsSorted.slice(0, TOP);
    const useOthers = catsSorted.length > TOP;
    const allCats = useOthers ? [...topCats, "Otros"] : topCats;

    // matriz month x category
    const matrix: number[][] = monthsSorted.map(() => allCats.map(() => 0));

    // llenar
    const idxMonth = new Map(monthsSorted.map((mm, i) => [keyMonth(mm.year, mm.month), i]));
    const idxCat = new Map(allCats.map((c, i) => [c, i]));

    for (const r of rawMonthlyCat) {
      const mkey = keyMonth(r.year, r.month);
      const mi = idxMonth.get(mkey);
      if (mi == null) continue;
      const cat = topCats.includes(r.category) ? r.category : (useOthers ? "Otros" : r.category);
      const ci = idxCat.get(cat);
      if (ci == null) continue;
      matrix[mi][ci] += r.total;
    }

    return { months: monthsSorted, categories: allCats, values: matrix };
  }, [rawMonthlyCat]);

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
        {/* FIX: actualizar preset y range */}
        <DateTimelineFilter
          value={preset}
          onChange={(p, r) => { setPreset(p); setRange(r); }}
        />
        <p className="mt-2 text-xs text-slate-500">Mostrando <b>{from}</b> → <b>{to}</b></p>
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
              value={<div className="flex items-center gap-2">{summary ? fmtMoney.format(summary.ingresos) : "—"} <ArrowUpRight className="h-4 w-4" /></div>}
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
              value={<div className="flex items-center gap-2">{summary ? fmtMoney.format(summary.gastos) : "—"} <ArrowDownRight className="h-4 w-4" /></div>}
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

      {/* Gráficos (mitad y mitad) */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2 overflow-hidden">
        {/* Evolución de balance */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-slate-300">Evolución de balance</div>
            <div className="text-xs text-slate-400">{from} → {to}</div>
          </div>
          <div className="h-64 overflow-hidden">
            {loading ? (
              <div className="grid h-full place-content-center text-slate-400 text-sm">Cargando…</div>
            ) : series && series.series.length > 0 ? (
              <MiniAreaChart data={series} />
            ) : (
              <div className="grid h-full place-content-center text-slate-400 text-sm">Sin datos</div>
            )}
          </div>
        </Card>

        {/* Gastos por mes apilado por categoría */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-slate-300">Gastos por mes (apilado por categoría)</div>
            <div className="text-xs text-slate-400">{from} → {to}</div>
          </div>
          <div className="h-64 overflow-hidden">
            {loading ? (
              <div className="grid h-full place-content-center text-slate-400 text-sm">Cargando…</div>
            ) : stacked && stacked.months.length > 0 ? (
              <MonthlyStackedBarsChart months={stacked.months} categories={stacked.categories} values={stacked.values} />
            ) : (
              <div className="grid h-full place-content-center text-slate-400 text-sm">Sin datos</div>
            )}
          </div>

          {/* leyenda */}
          {stacked && (
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-3">
              {stacked.categories.map((c, i) => (
                <li key={c} className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: colorFor(i) }} />
                  <span className="text-slate-300">{c}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </AppShell>
  );
}

// ===== Charts (SVG puros)
function MiniAreaChart({ data }: { data: BalanceSeries }) {
  const width = 520, height = 220, pad = 12;
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
    <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full">
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

/** Barras apiladas por mes con contorno de columna redondeado (clipPath) */
function MonthlyStackedBarsChart({
  months,
  categories,
  values,
}: {
  months: { year: number; month: number }[];
  categories: string[];
  values: number[][];
}) {
  const width = 520, height = 220, pad = 24, bottom = 40, left = 46;
  const innerW = width - left - pad;
  const innerH = height - bottom - pad;
  const xStep = innerW / Math.max(1, months.length);
  const barW = Math.max(10, xStep * 0.65);

  // escala Y basada en total mensual
  const totals = values.map(row => row.reduce((a, b) => a + b, 0));
  const maxV = Math.max(1, ...totals);
  const y = (v: number) => {
    const t = v / maxV;
    return pad + innerH - t * innerH;
  };

  const monthLabelShort = (yy: number, mm: number) =>
    new Date(Date.UTC(yy, mm - 1, 1)).toLocaleDateString("es-AR", { month: "short" });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full">
      {/* eje X */}
      <line x1={left} y1={pad + innerH} x2={left + innerW} y2={pad + innerH} stroke="rgba(148,163,184,0.25)" />

      {values.map((row, i) => {
        const x = left + i * xStep + (xStep - barW) / 2;
        const total = totals[i];

        // contorno redondeado de la columna (clip)
        const radius = 7;
        const yTop = y(total);
        const yBottom = pad + innerH;
        const hBar = Math.max(0, yBottom - yTop);
        const rr = Math.min(radius, hBar / 2, barW / 2);
        const roundedPath = [
          `M ${x + rr} ${yTop}`,
          `H ${x + barW - rr}`,
          `Q ${x + barW} ${yTop} ${x + barW} ${yTop + rr}`,
          `V ${yBottom - rr}`,
          `Q ${x + barW} ${yBottom} ${x + barW - rr} ${yBottom}`,
          `H ${x + rr}`,
          `Q ${x} ${yBottom} ${x} ${yBottom - rr}`,
          `V ${yTop + rr}`,
          `Q ${x} ${yTop} ${x + rr} ${yTop}`,
          "Z",
        ].join(" ");

        // acumulador para apilar
        let acc = 0;

        return (
          <g key={`m-${i}`}>
            {/* fondo tenue del contorno */}
            <path d={roundedPath} fill="rgba(148,163,184,0.12)" />

            {/* clip redondeado */}
            <clipPath id={`clip-col-${i}`}>
              <path d={roundedPath} />
            </clipPath>

            {/* segmentos apilados recortados por el contorno */}
            <g clipPath={`url(#clip-col-${i})`}>
              {row.map((v, j) => {
                if (v <= 0) return null;
                const y0 = y(acc);
                acc += v;
                const y1 = y(acc);
                const h = Math.max(0, y0 - y1);
                return (
                  <rect
                    key={`seg-${i}-${j}`}
                    x={x}
                    y={y1}
                    width={barW}
                    height={h}
                    fill={colorFor(j)}
                  />
                );
              })}
            </g>

            {/* valor total arriba */}
            <text x={x + barW / 2} y={y(total) - 6} textAnchor="middle" className="text-[10px] fill-slate-300">
              {new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(total)}
            </text>
          </g>
        );
      })}

      {/* labels de meses */}
      {months.map((mm, i) => {
        const x = left + i * xStep + xStep / 2;
        return (
          <text key={`lab-${i}`} x={x} y={height - 16} textAnchor="middle" className="text-[10px] fill-slate-400">
            {monthLabelShort(mm.year, mm.month)}
          </text>
        );
      })}
    </svg>
  );
}
