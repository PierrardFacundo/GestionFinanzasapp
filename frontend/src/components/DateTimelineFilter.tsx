import React from "react";

export type PresetKey =
  | "today"
  | "last7"
  | "last30"
  | "last60"
  | "last180"
  | "last365"
  | "last730"
  | "last1825";

export const PRESETS: { key: PresetKey; label: string }[] = [
  { key: "today",    label: "Día actual" },
  { key: "last7",    label: "Últ. semana" },
  { key: "last30",   label: "Últ. mes" },
  { key: "last60",   label: "Últ. 2 meses" },
  { key: "last180",  label: "Últ. 6 meses" },
  { key: "last365",  label: "Últ. año" },
  { key: "last730",  label: "Últ. 2 años" },
  { key: "last1825", label: "Últ. 5 años" },
];

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

/** Devuelve { from, to } en ISO (YYYY-MM-DD) según el preset elegido */
export function rangeForPreset(preset: PresetKey): { from: string; to: string } {
  const now = new Date();
  const to = endOfDay(now);
  const from = startOfDay(
    (() => {
      const d = new Date(now);
      switch (preset) {
        case "today":    return d;
        case "last7":    d.setDate(d.getDate() - 7);    return d;
        case "last30":   d.setDate(d.getDate() - 30);   return d;
        case "last60":   d.setDate(d.getDate() - 60);   return d;
        case "last180":  d.setDate(d.getDate() - 180);  return d;
        case "last365":  d.setDate(d.getDate() - 365);  return d;
        case "last730":  d.setDate(d.getDate() - 730);  return d;
        case "last1825": d.setDate(d.getDate() - 1825); return d;
      }
    })()
  );
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { from: iso(from), to: iso(to) };
}

interface Props {
  value: PresetKey;
  onChange: (value: PresetKey, range: { from: string; to: string }) => void;
  className?: string;
}

/** Timeline clickeable estilo “roadmap” */
export default function DateTimelineFilter({ value, onChange, className }: Props) {
  return (
    <div className={className}>
      <div className="relative mx-auto flex items-center gap-4 overflow-x-auto pb-2 pt-4">
        {/* línea base */}
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-slate-700/60" />
        {PRESETS.map((p) => {
          const selected = p.key === value;
          return (
            <button
              key={p.key}
              onClick={() => onChange(p.key, rangeForPreset(p.key))}
              className="relative z-10 flex min-w-[110px] flex-col items-center gap-2 focus:outline-none"
              title={p.label}
            >
              <span
                className={[
                  "grid place-items-center rounded-full border h-8 w-8 transition",
                  selected
                    ? "bg-indigo-500 text-white border-indigo-400 shadow-md shadow-indigo-500/30"
                    : "bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800",
                ].join(" ")}
              >
                <span className={["h-2 w-2 rounded-full", selected ? "bg-white" : "bg-slate-500"].join(" ")} />
              </span>
              <span className={["text-xs", selected ? "text-indigo-300" : "text-slate-400"].join(" ")}>{p.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
