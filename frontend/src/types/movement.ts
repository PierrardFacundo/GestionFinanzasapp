export type MovementType = "entrada" | "salida";

export interface Movement {
  _id: string;
  type: MovementType;
  amount: number;
  date: string;        // ISO
  category: string;
  note?: string;
  createdAt: string;   // ISO
  updatedAt: string;   // ISO
}

export interface MovementList {
  items: Movement[];
  total: number;
  page: number;
  limit: number;
}

export interface Summary {
  ingresos: number;
  gastos: number;
  balance: number;
}

export interface BalancePoint {
  date: string;   // ISO day
  delta: number;  // cambio del día (+ingresos, -gastos)
  balance: number; // acumulado
}
export interface BalanceSeries {
  start: string;  // ISO
  end: string;    // ISO
  series: BalancePoint[];
}

export interface CategorySlice {
  category: string;
  total: number;
  pct: number; // 0..1
}
export interface ExpensesByCategory {
  year: number;
  month: number; // 1..12
  total: number;
  data: CategorySlice[];
}
