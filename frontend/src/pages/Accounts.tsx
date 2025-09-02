import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { accounts } from "@/data/mock"

export default function Accounts() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {accounts.map(acc => (
        <Card key={acc.id}>
          <CardHeader><CardTitle>{acc.name}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-neutral-500 dark:text-neutral-400">{acc.type}</div>
            <div className={acc.balance >= 0 ? "text-2xl font-semibold text-green-600 dark:text-green-400" : "text-2xl font-semibold text-red-600 dark:text-red-400"}>
              {acc.balance >= 0 ? "$ " + acc.balance.toLocaleString("es-AR") : "-$ " + Math.abs(acc.balance).toLocaleString("es-AR")}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
