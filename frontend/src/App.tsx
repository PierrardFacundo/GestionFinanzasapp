import Topbar from "@/components/Topbar"
import Sidebar from "@/components/Sidebar"
import Dashboard from "@/pages/Dashboard"
import Transactions from "@/pages/Transactions"
import Accounts from "@/pages/Accounts"
import Budgets from "@/pages/Budgets"
import Reports from "@/pages/Reports"
import Settings from "@/pages/Settings"
import { Route, Routes } from "react-router-dom"

export default function App() {
  return (
    <div className="min-h-screen">
      <Topbar />
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 md:grid-cols-[16rem_1fr]">
        <Sidebar />
        <main className="px-4 py-6 md:px-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transacciones" element={<Transactions />} />
            <Route path="/cuentas" element={<Accounts />} />
            <Route path="/presupuestos" element={<Budgets />} />
            <Route path="/reportes" element={<Reports />} />
            <Route path="/ajustes" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
