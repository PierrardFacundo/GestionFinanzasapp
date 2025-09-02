import { Badge } from "@/components/ui/badge"

export interface Column<T> {
  key: keyof T
  label: string
  render?: (row: T) => React.ReactNode
  className?: string
}

export default function DataTable<T extends { id: string | number }>({ columns, rows }: { columns: Column<T>[]; rows: T[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border">
      <table className="min-w-full text-sm">
        <thead className="bg-neutral-50/60 dark:bg-neutral-900/60">
          <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-left">
            {columns.map((c) => (
              <th key={String(c.key)} className={c.className}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="[&>tr]:border-t">
          {rows.map((row) => (
            <tr key={row.id} className="[&>td]:px-4 [&>td]:py-3">
              {columns.map((c) => (
                <td key={String(c.key)} className={c.className}>
                  {c.render ? c.render(row) : String(row[c.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function StatusBadge({ status }: { status: "income" | "expense" }) {
  return (
    <Badge className={status === "income" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200 border-green-300 dark:border-green-800" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200 border-red-300 dark:border-red-800"}>
      {status === "income" ? "Ingreso" : "Gasto"}
    </Badge>
  )
}
