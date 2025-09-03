import React from "react";
import { ArrowUpRight, ArrowDownRight, PiggyBank, Wallet, LineChart } from "lucide-react";
import AppShell from "@/layouts/AppShell";
import { Card, Stat } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Stagger, item } from "@/components/animations/Reveal";

export default function Dashboard() {
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
        <button className="rounded-xl border border-slate-700/80 bg-slate-900/40 px-4 py-2 text-sm text-slate-200 backdrop-blur transition hover:bg-slate-900/60">
          Agregar movimiento
        </button>
      }
    >
      {/* KPIs */}
      <Stagger>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={item}>
            <Card>
              <div className="flex items-center justify-between">
                <Stat label="Balance actual" value={"$ 42.500"} hint="al día de hoy" />
                <span className="grid h-10 w-10 place-content-center rounded-xl bg-emerald-500/10 text-emerald-300">
                  <Wallet className="h-5 w-5" />
                </span>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <div className="flex items-center justify-between">
                <Stat
                  label="Ingresos (mes)"
                  value={
                    <div className="flex items-center gap-2">
                      $ 12.400 <ArrowUpRight className="h-4 w-4" />
                    </div>
                  }
                  hint="+8% vs mes anterior"
                />
                <span className="grid h-10 w-10 place-content-center rounded-xl bg-emerald-500/10 text-emerald-300">
                  <PiggyBank className="h-5 w-5" />
                </span>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <div className="flex items-center justify-between">
                <Stat
                  label="Gastos (mes)"
                  value={
                    <div className="flex items-center gap-2">
                      $ 9.150 <ArrowDownRight className="h-4 w-4" />
                    </div>
                  }
                  hint="-3% vs mes anterior"
                />
                <span className="grid h-10 w-10 place-content-center rounded-xl bg-emerald-500/10 text-emerald-300">
                  <LineChart className="h-5 w-5" />
                </span>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <div className="flex items-center justify-between">
                <Stat label="Ahorro estimado" value="$ 3.250" hint="objetivo: $ 4.000" />
                <span className="grid h-10 w-10 place-content-center rounded-xl bg-emerald-500/10 text-emerald-300">
                  <Wallet className="h-5 w-5" />
                </span>
              </div>
            </Card>
          </motion.div>
        </div>
      </Stagger>

      {/* Gráfico + listas */}
      <Stagger>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <motion.div variants={item} className="lg:col-span-2">
            <Card>
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm text-slate-300">Evolución de balance</div>
                <div className="text-xs text-slate-400">Últimos 6 meses</div>
              </div>
              <MiniAreaChart />
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <div className="mb-3 text-sm text-slate-300">Próximos vencimientos</div>
              <ul className="space-y-3 text-sm">
                {[
                  { name: "Tarjeta Visa", date: "12 Sep", amount: "$ 120.00" },
                  { name: "Alquiler", date: "15 Sep", amount: "$ 450.00" },
                  { name: "Internet", date: "20 Sep", amount: "$ 45.00" },
                ].map((i) => (
                  <li
                    key={i.name}
                    className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-950/60 px-3 py-2"
                  >
                    <span className="text-slate-200">{i.name}</span>
                    <span className="text-slate-400">{i.date}</span>
                    <span className="font-medium text-white">{i.amount}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>
      </Stagger>

      {/* Metas */}
      <Stagger>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "Fondo de emergencia", v: 65 },
            { t: "Viaje", v: 30 },
            { t: "Inversión", v: 45 },
          ].map((g) => (
            <motion.div key={g.t} variants={item}>
              <Card>
                <div className="mb-2 text-sm text-slate-300">{g.t}</div>
                <Progress value={g.v} />
              </Card>
            </motion.div>
          ))}
        </div>
      </Stagger>
    </AppShell>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div className="h-3 w-full rounded-full bg-slate-800">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className="h-3 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-sky-300"
      />
      <div className="mt-2 text-right text-xs text-slate-300">{value}%</div>
    </div>
  );
}

function MiniAreaChart() {
  return (
    <svg viewBox="0 0 320 140" className="h-40 w-full">
      <defs>
        <linearGradient id="fillGrad2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(16,185,129,0.55)" />
          <stop offset="100%" stopColor="rgba(16,185,129,0.0)" />
        </linearGradient>
      </defs>
      <path
        d="M0,96 C40,82 60,80 80,88 C100,96 120,70 140,74 C160,78 180,58 200,64 C220,70 240,50 260,56 C280,62 300,46 320,52 L320,140 L0,140 Z"
        fill="url(#fillGrad2)"
      />
      <path
        d="M0,96 C40,82 60,80 80,88 C100,96 120,70 140,74 C160,78 180,58 200,64 C220,70 240,50 260,56 C280,62 300,46 320,52"
        stroke="rgb(52,211,153)"
        strokeWidth="3"
        fill="none"
      />
      <line x1="0" y1="139" x2="320" y2="139" stroke="rgba(148,163,184,0.25)" />
    </svg>
  );
}
