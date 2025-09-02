import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { budgets } from "@/data/mock"

export default function Budgets() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {budgets.map(b => {
        const pct = Math.round((b.used / b.limit) * 100)
        return (
          <Card key={b.id}>
            <CardHeader><CardTitle>{b.name}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Usado: $ {b.used.toLocaleString("es-AR")}</span>
                <span>De: $ {b.limit.toLocaleString("es-AR")}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-800">
                <div className="h-2 rounded-full bg-neutral-900 dark:bg-neutral-100" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">{pct}% del presupuesto</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
