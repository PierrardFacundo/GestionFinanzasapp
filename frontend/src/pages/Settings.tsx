import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

export default function Settings() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Preferencias</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="mb-1 block">Moneda</Label>
            <Select defaultValue="ARS">
              <option value="ARS">ARS (Peso Argentino)</option>
              <option value="USD">USD (Dólar)</option>
              <option value="EUR">EUR (Euro)</option>
            </Select>
          </div>
          <div>
            <Label className="mb-1 block">Separador de miles</Label>
            <Select defaultValue=".">
              <option value=".">Punto (1.234)</option>
              <option value=",">Coma (1,234)</option>
              <option value=" ">Espacio (1 234)</option>
            </Select>
          </div>
          <div>
            <Label className="mb-1 block">Formato de fecha</Label>
            <Select defaultValue="DMY">
              <option value="DMY">DD/MM/AAAA</option>
              <option value="MDY">MM/DD/AAAA</option>
              <option value="YMD">AAAA/MM/DD</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Perfil</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="mb-1 block">Nombre</Label>
            <Input placeholder="Tu nombre" />
          </div>
          <div>
            <Label className="mb-1 block">Email</Label>
            <Input placeholder="tu@email.com" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
