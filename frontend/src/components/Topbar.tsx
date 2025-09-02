import { Moon, Sun, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function Topbar() {
  const [theme, setTheme] = useState<"light" | "dark">(() => (localStorage.getItem("theme") as "light" | "dark") || "light")

  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") root.classList.add("dark")
    else root.classList.remove("dark")
    localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/70 backdrop-blur dark:bg-neutral-950/70">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-soft">
            <Wallet size={20} />
          </div>
          <div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">Gestión de</div>
            <div className="text-lg font-semibold leading-tight">Finanzas</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Cambiar tema" onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>
      </div>
    </header>
  )
}
