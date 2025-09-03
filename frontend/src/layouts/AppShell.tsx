// =============================
// src/layouts/AppShell.tsx
// Reutiliza la estética/UX de Welcome para el resto de las pantallas
// =============================
import React from "react";
import { MotionConfig, motion } from "framer-motion";

export default function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <MotionConfig transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
      <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
        {/* Glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

        {/* Contenido */}
        <div className="mx-auto w-full max-w-7xl px-6 py-6">
          {/* Header de página */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
              {subtitle && (
                <p className="mt-1 max-w-2xl text-sm text-slate-300">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </motion.div>

          {/* Body */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}

