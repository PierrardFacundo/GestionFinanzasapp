export const kpis = {
  balance: "$ 1.248.300",
  incomes: "$ 320.500",
  expenses: "$ 210.200",
  savings: "$ 110.300"
}

export const flow = [
  { name: "Ene", value: 1200 },
  { name: "Feb", value: 950 },
  { name: "Mar", value: 1400 },
  { name: "Abr", value: 1100 },
  { name: "May", value: 1700 },
  { name: "Jun", value: 1500 }
]

export const categories = [
  { name: "Alquiler", value: 35 },
  { name: "Comida", value: 25 },
  { name: "Transporte", value: 10 },
  { name: "Entretenimiento", value: 8 },
  { name: "Otros", value: 22 }
]

export type Transaction = {
  id: string
  date: string
  description: string
  category: string
  amount: number
  type: "income" | "expense"
  account: string
}

export const transactions: Transaction[] = [
  { id: "t1", date: "2025-08-25", description: "Sueldo", category: "Salario", amount: 280000, type: "income", account: "Banco Nación" },
  { id: "t2", date: "2025-08-26", description: "Alquiler", category: "Alquiler", amount: -160000, type: "expense", account: "Banco Nación" },
  { id: "t3", date: "2025-08-27", description: "Supermercado", category: "Comida", amount: -42000, type: "expense", account: "Tarjeta Visa" },
  { id: "t4", date: "2025-08-27", description: "Freelance", category: "Ingresos", amount: 40500, type: "income", account: "MercadoPago" },
  { id: "t5", date: "2025-08-28", description: "Netflix", category: "Entretenimiento", amount: -6500, type: "expense", account: "Tarjeta Visa" }
]

export const accounts = [
  { id: "a1", name: "Banco Nación", type: "Cuenta Sueldo", balance: 870000 },
  { id: "a2", name: "MercadoPago", type: "Billetera", balance: 185000 },
  { id: "a3", name: "Tarjeta Visa", type: "Crédito", balance: -56000 }
]

export const budgets = [
  { id: "b1", name: "Comida", limit: 90000, used: 42000 },
  { id: "b2", name: "Entretenimiento", limit: 30000, used: 11000 },
  { id: "b3", name: "Transporte", limit: 25000, used: 13000 }
]
