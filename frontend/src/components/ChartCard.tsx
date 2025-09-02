import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts"

export function LineChartCard({ title, data }: { title: string; data: { name: string; value: number }[] }) {
  return (
    <Card className="h-80">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
export function PieChartCard({ title, data }: { title: string; data: { name: string; value: number }[] }) {
  const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#f59e0b", "#9333ea"] // azul, verde, rojo, amarillo, violeta

  return (
    <Card className="h-80">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
              {data.map((entry, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
