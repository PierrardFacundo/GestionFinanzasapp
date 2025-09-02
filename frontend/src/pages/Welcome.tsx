import React from "react";
import { Link } from "react-router-dom";
import { MotionConfig, motion } from "framer-motion";
import { ArrowRight, LineChart, PiggyBank, ShieldCheck } from "lucide-react";

/**
 * ✅ Cómo integrarlo (sin romper lo que ya tienes)
 *
 * 1) Guarda este archivo como: src/pages/Welcome.tsx
 * 2) En tu archivo de rutas, agrega la ruta "welcome":
 *    import Welcome from "./pages/Welcome";
 *    <Route path="/welcome" element={<Welcome />} />
 *
 * 3) Asegúrate de que tu pantalla principal (la que YA existe) esté en una ruta como 
 *    "/app" o "/dashboard". Si es otra, cambia TARGET_ROUTE más abajo.
 *
 * 4) (Opcional) Haz que la app abra por la bienvenida:
 *    - Redirige "/" -> "/welcome" con <Navigate to="/welcome" replace />
 *
 * Si usas Next.js, crea app/welcome/page.tsx y reemplaza <Link to="..."/> por <Link href="..."/>.
 */

// 👉 Ajusta esto si tu ruta principal es diferente

const TARGET_ROUTE = "/dashboard";


export default function Welcome() {
  return (
    <MotionConfig transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
        {/* Glow / Gradients de fondo */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

        {/* Navbar minimal */}
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <div className="grid h-8 w-8 place-content-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-400/30">
              <LineChart className="h-5 w-5 text-emerald-300" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Gestión Finanzas</span>
          </motion.div>
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden gap-6 md:flex"
          >
            <a className="text-sm text-slate-300 hover:text-white" href="#features">Características</a>
            <a className="text-sm text-slate-300 hover:text-white" href="#seguridad">Seguridad</a>
            <a className="text-sm text-slate-300 hover:text-white" href="#cta">Ir a la app</a>
          </motion.nav>
        </header>

        {/* Hero */}
        <main className="mx-auto w-full max-w-7xl px-6 pb-24 pt-6">
          <section className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold leading-tight sm:text-5xl"
              >
                Toma el control de tus finanzas
                <span className="block bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
                  con claridad y confianza
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mt-5 max-w-xl text-base leading-relaxed text-slate-300"
              >
                Visualiza tu progreso, organiza gastos e ingresos, y toma decisiones respaldadas por datos.
                Esta es tu plataforma para planificar, crecer y alcanzar tus metas.
              </motion.p>

              {/* Botones */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <Link to={TARGET_ROUTE} id="cta" className="group inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-medium text-slate-900 shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-400/60 transition hover:translate-y-[-1px] hover:bg-emerald-400">
                  Entrar a mi panel
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
                <a href="#features" className="inline-flex items-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-900/40 px-5 py-3 text-slate-200 backdrop-blur transition hover:bg-slate-900/60">
                  Ver características
                </a>
              </motion.div>

              {/* Badges de confianza */}
              <motion.ul
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
                className="mt-8 grid grid-cols-2 gap-3 text-sm text-slate-300 sm:grid-cols-3"
              >
                {["Presupuestos", "Metas", "Reportes", "Alertas", "Proyecciones", "Insights"].map((label, i) => (
                  <motion.li
                    key={label}
                    variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                    className="rounded-xl border border-slate-800/80 bg-slate-900/40 px-3 py-2 text-center"
                  >
                    {label}
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* Lado visual: gráfica + tarjetas */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-3xl border border-slate-700/60 bg-slate-900/50 p-5 shadow-2xl backdrop-blur-lg"
              >
                {/* Gráfico mini (SVG) */}
                <div className="rounded-2xl border border-slate-700/60 bg-slate-950 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-300">
                    <LineChart className="h-4 w-4" />
                    <span className="text-sm">Evolución de balance</span>
                  </div>
                  <ChartSparkline />
                </div>

                {/* Tarjetas flotantes */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <FloatingCard icon={<PiggyBank className="h-5 w-5" />} title="Ahorro" value="+$1,250" subtitle="este mes" />
                  <FloatingCard icon={<ShieldCheck className="h-5 w-5" />} title="Riesgo" value="Bajo" subtitle="diversificado" />
                </div>
              </motion.div>

              {/* Monedas animadas */}
              <Coin className="left-[-10px] top-6" delay={0} />
              <Coin className="right-[-12px] top-24" delay={0.2} />
              <Coin className="left-10 -bottom-4" delay={0.35} />
            </div>
          </section>

          {/* Sección Features */}
          <section id="features" className="mt-20 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Presupuestos inteligentes",
                desc: "Crea categorías, límites y seguimiento automático.",
              },
              {
                title: "Metas medibles",
                desc: "Define objetivos y visualiza el avance en tiempo real.",
              },
              {
                title: "Reportes claros",
                desc: "Gráficos y resumenes que explican tu situación al instante.",
              },
            ].map((f, idx) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5"
              >
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{f.desc}</p>
              </motion.div>
            ))}
          </section>

          {/* CTA final */}
          <section id="cta" className="mt-16 text-center">
            <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-semibold">Listo para avanzar</h2>
              <p className="mx-auto mt-2 max-w-2xl text-slate-300">
                Ingresa a tu panel para registrar movimientos, ver reportes y gestionar tus metas.
              </p>
              <div className="mt-6">
                <Link to={TARGET_ROUTE} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 font-medium text-slate-900 shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-400/60 transition hover:translate-y-[-1px] hover:bg-emerald-400">
                  Entrar ahora
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mx-auto w-full max-w-7xl px-6 pb-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Gestión Finanzas · Hecho con disciplina y enfoque
        </footer>
      </div>
    </MotionConfig>
  );
}

function FloatingCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      className="rounded-2xl border border-slate-700/60 bg-slate-950/70 p-4 shadow-2xl"
    >
      <div className="mb-3 flex items-center gap-2 text-slate-200">
        <span className="grid h-8 w-8 place-content-center rounded-xl bg-emerald-500/10 text-emerald-300">
          {icon}
        </span>
        <span className="text-sm">{title}</span>
      </div>
      <div className="text-xl font-semibold text-white">{value}</div>
      <div className="text-xs text-slate-400">{subtitle}</div>
    </motion.div>
  );
}

function Coin({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, rotate: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      transition={{ delay }}
      className={`pointer-events-none absolute ${className}`}
    >
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-300 via-amber-300 to-orange-300 shadow-xl ring-2 ring-yellow-200/60" />
    </motion.div>
  );
}

function ChartSparkline() {
  // Mini sparkline SVG con área y línea
  return (
    <svg viewBox="0 0 320 120" className="h-28 w-full">
      <defs>
        <linearGradient id="fillGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(16,185,129,0.55)" />
          <stop offset="100%" stopColor="rgba(16,185,129,0.0)" />
        </linearGradient>
      </defs>
      <path
        d="M0,86 C40,72 60,70 80,78 C100,86 120,60 140,64 C160,68 180,48 200,54 C220,60 240,40 260,46 C280,52 300,36 320,42 L320,120 L0,120 Z"
        fill="url(#fillGrad)"
      />
      <path
        d="M0,86 C40,72 60,70 80,78 C100,86 120,60 140,64 C160,68 180,48 200,54 C220,60 240,40 260,46 C280,52 300,36 320,42"
        stroke="rgb(52,211,153)"
        strokeWidth="3"
        fill="none"
      />
      {/* ejes sutiles */}
      <line x1="0" y1="119" x2="320" y2="119" stroke="rgba(148,163,184,0.25)" />
    </svg>
  );
}
