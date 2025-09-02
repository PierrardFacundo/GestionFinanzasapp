import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Reports() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="h-64">
        <CardHeader><CardTitle>Ingresos vs Gastos</CardTitle></CardHeader>
        <CardContent className="text-sm text-neutral-500 dark:text-neutral-400">
          Placeholder de reportes. Acá podemos sumar más gráficos, comparativas por período y descarga a PDF.
        </CardContent>
      </Card>
      <Card className="h-64">
        <CardHeader><CardTitle>Evolución de ahorro</CardTitle></CardHeader>
        <CardContent className="text-sm text-neutral-500 dark:text-neutral-400">
          Placeholder de reportes. Cuando definamos el MVP final, conectamos con datos reales.
        </CardContent>
      </Card>
    </div>
  )
}
