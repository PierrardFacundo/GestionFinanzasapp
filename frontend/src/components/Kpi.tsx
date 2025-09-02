import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Kpi({ title, value, hint }: { title: string; value: string; hint?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        {hint && <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{hint}</div>}
      </CardContent>
    </Card>
  )
}
