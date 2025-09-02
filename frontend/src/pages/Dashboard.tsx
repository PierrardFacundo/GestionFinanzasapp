import Kpi from "@/components/Kpi"
import { LineChartCard, PieChartCard } from "@/components/ChartCard"
import DataTable, { StatusBadge, Column } from "@/components/DataTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { kpis, flow, categories, transactions, type Transaction } from "@/data/mock"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

export default function Dashboard() {
  const columns: Column<Transaction>[] = [
    { key: "date", label: "Fecha" },
    { key: "description", label: "Descripción" },
    { key: "category", label: "Categoría" },
    { key: "amount", label: "Monto", render: (r) => <span className={r.amount < 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}>${Math.abs(r.amount).toLocaleString("es-AR")}</span>, className: "text-right" },
    { key: "type", label: "Tipo", render: (r) => <StatusBadge status={r.type} /> },
    { key: "account", label: "Cuenta" }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Kpi title="Balance actual" value={kpis.balance} hint="+$ 45.200 este mes" />
        <Kpi title="Ingresos" value={kpis.incomes} hint="+8% vs mes anterior" />
        <Kpi title="Gastos" value={kpis.expenses} hint="-3% vs mes anterior" />
        <Kpi title="Ahorro" value={kpis.savings} hint="Meta: $ 200.000" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LineChartCard title="Flujo de caja (últimos meses)" data={flow} />
        </div>
        <div>
          <PieChartCard title="Gastos por categoría (%)" data={categories} />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Movimientos recientes</CardTitle>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Fuente: datos de ejemplo</div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} rows={transactions.slice(0, 5)} />
          <div className="mt-3 text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
            <ArrowUpRight size={14} /> Ingreso &nbsp;&nbsp; <ArrowDownRight size={14} /> Gasto
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
