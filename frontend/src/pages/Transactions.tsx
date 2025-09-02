import DataTable, { Column, StatusBadge } from "@/components/DataTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { transactions, type Transaction } from "@/data/mock"
import { useMemo, useState } from "react"

export default function Transactions() {
  const [q, setQ] = useState("")
  const [type, setType] = useState<"" | "income" | "expense">("")
  const [category, setCategory] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  const data = useMemo(() => {
    return transactions.filter(t => {
      const matchText = q ? (t.description.toLowerCase().includes(q.toLowerCase()) || t.category.toLowerCase().includes(q.toLowerCase())) : true
      const matchType = type ? t.type === type : true
      const matchCat = category ? t.category === category : true
      const matchFrom = from ? (new Date(t.date) >= new Date(from)) : true
      const matchTo = to ? (new Date(t.date) <= new Date(to)) : true
      return matchText && matchType && matchCat && matchFrom && matchTo
    })
  }, [q, type, category, from, to])

  const columns: Column<Transaction>[] = [
    { key: "date", label: "Fecha" },
    { key: "description", label: "Descripción" },
    { key: "category", label: "Categoría" },
    { key: "amount", label: "Monto", render: (r) => <span className={r.amount < 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}>${Math.abs(r.amount).toLocaleString("es-AR")}</span>, className: "text-right" },
    { key: "type", label: "Tipo", render: (r) => <StatusBadge status={r.type} /> },
    { key: "account", label: "Cuenta" }
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Filtros</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-5">
          <div className="md:col-span-2">
            <Label className="mb-1 block">Buscar</Label>
            <Input placeholder="Descripción o categoría..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">Tipo</Label>
            <Select value={type} onChange={(e) => setType(e.target.value as any)}>
              <option value="">Todos</option>
              <option value="income">Ingresos</option>
              <option value="expense">Gastos</option>
            </Select>
          </div>
          <div>
            <Label className="mb-1 block">Desde</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">Hasta</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transacciones</CardTitle>
          <div className="flex gap-2">
            <Button variant="secondary">Exportar CSV</Button>
            <Button>+ Nueva</Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} rows={data} />
        </CardContent>
      </Card>
    </div>
  )
}
