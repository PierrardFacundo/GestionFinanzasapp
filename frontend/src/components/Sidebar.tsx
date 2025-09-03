import { NavLink } from "react-router-dom"
import { BarChart2, CreditCard, Home, Layers, Settings, Wallet } from "lucide-react"

const links = [
  { to: "/dashboard", label: "Dashboard", icon: Home }, // 👈 antes era "/"
  { to: "/transacciones", label: "Transacciones", icon: Layers },
  { to: "/cuentas", label: "Cuentas", icon: CreditCard },
  { to: "/presupuestos", label: "Presupuestos", icon: Wallet },
  { to: "/reportes", label: "Reportes", icon: BarChart2 },
  { to: "/ajustes", label: "Ajustes", icon: Settings }
];


export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col border-r border-slate-800/60 bg-slate-950/40 backdrop-blur">
      <nav className="sticky top-[68px] flex h-[calc(100dvh-68px)] flex-col gap-1 p-3">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                isActive
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
              ].join(" ")
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
        <div className="mt-auto p-3 text-xs text-neutral-500 dark:text-neutral-400">v0.1.0</div>
      </nav>
    </aside>
  )
}
