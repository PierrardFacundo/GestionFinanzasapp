// src/components/ui/card.tsx
import * as React from "react";
import { motion } from "framer-motion";

// ✔ Usamos los tipos nativos de framer-motion para un <motion.div>
type MotionDivProps = React.ComponentProps<typeof motion.div>;

/** Contenedor con animación y el look de la Welcome */
export function Card(props: MotionDivProps) {
  const {
    className = "",
    initial = { opacity: 0, y: 8 },   // defaults seguros
    animate = { opacity: 1, y: 0 },
    ...rest
  } = props;

  return (
    <motion.div
      initial={initial}
      animate={animate}
      className={`rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 backdrop-blur ${className}`}
      {...rest}
    />
  );
}

// Resto de helpers en base a <div>
type DivProps = React.ComponentPropsWithoutRef<"div">;

export function CardHeader({ className = "", ...rest }: DivProps) {
  return <div className={`mb-3 flex items-center justify-between ${className}`} {...rest} />;
}

export function CardTitle({ className = "", ...rest }: DivProps) {
  return <h3 className={`text-sm font-semibold text-slate-200 ${className}`} {...rest} />;
}

export function CardDescription({ className = "", ...rest }: DivProps) {
  return <p className={`text-xs text-slate-400 ${className}`} {...rest} />;
}

export function CardContent({ className = "", ...rest }: DivProps) {
  return <div className={className} {...rest} />;
}

export function CardFooter({ className = "", ...rest }: DivProps) {
  return <div className={`mt-3 flex items-center justify-end gap-2 ${className}`} {...rest} />;
}

/** KPI compacto que usamos en el Dashboard */
export function Stat({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div>
      <div className="text-sm text-slate-300">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
      {hint && <div className="text-xs text-slate-400">{hint}</div>}
    </div>
  );
}



