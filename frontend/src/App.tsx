import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";

import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import Accounts from "@/pages/Accounts";
import Budgets from "@/pages/Budgets";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import Welcome from "@/pages/Welcome";

export default function App() {
  const { pathname } = useLocation();
  const isWelcome = pathname === "/welcome";

  return (
    // Contenedor ÚNICO que scrollea (con scrollbar oculto)
    <div id="app-scroll" className="fixed inset-0 overflow-y-auto bg-slate-950 no-scrollbar">
      {!isWelcome && <Topbar />}

      <div className={isWelcome ? "" : "mx-auto grid max-w-screen-2xl grid-cols-1 md:grid-cols-[260px_1fr]"}>
        {!isWelcome && <Sidebar />}

        <main className={isWelcome ? "" : "px-4 py-6 md:px-6 pb-24"}>
          <Routes>
            {/* Pantalla de bienvenida */}
            <Route path="/welcome" element={<Welcome />} />

            {/* App existente */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transacciones" element={<Transactions />} />
            <Route path="/cuentas" element={<Accounts />} />
            <Route path="/presupuestos" element={<Budgets />} />
            <Route path="/reportes" element={<Reports />} />
            <Route path="/ajustes" element={<Settings />} />

            {/* Redirecciones */}
            <Route path="/" element={<Navigate to="/welcome" replace />} />
            <Route path="*" element={<Navigate to="/welcome" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}


