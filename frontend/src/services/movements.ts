import { get, post, patch, del } from "@/services/api";
import type {
  Movement, MovementList, MovementType,
  Summary, BalanceSeries, ExpensesByCategory
} from "@/types/movement";

export interface MovementFilters extends Record<string, unknown> {
  from?: string;
  to?: string;
  type?: MovementType;
  category?: string;
  page?: number;
  limit?: number;
}

export function getExpensesMonthly(params?: { from?: string; to?: string }) {
  return get<{ data: { year: number; month: number; total: number }[] }>(
    "/api/stats/expenses-monthly",
    params
  );
}

export function getExpensesMonthlyByCategory(params?: { from?: string; to?: string }) {
  return get<{ data: { year: number; month: number; category: string; total: number }[] }>(
    "/api/stats/expenses-monthly-by-category",
    params
  );
}



export interface CreateMovementInput {
  type: MovementType;
  amount: number;
  date: string;      // ISO
  category: string;
  note?: string;
}

export type UpdateMovementInput = Partial<CreateMovementInput>;

export function listMovements(filters: MovementFilters = {}) {
  return get<MovementList>("/api/movements", filters);
}

export function createMovement(data: CreateMovementInput) {
  return post<Movement>("/api/movements", data);
}

export function updateMovement(id: string, data: UpdateMovementInput) {
  return patch<Movement>(`/api/movements/${id}`, data);
}

export function deleteMovement(id: string) {
  return del<{ ok: true }>(`/api/movements/${id}`);
}

// Stats para Dashboard
export function getSummary() {
  return get<Summary>("/api/stats/summary");
}

export function getBalanceSeries(params?: { from?: string; to?: string }) {
  return get<BalanceSeries>("/api/stats/balance-series", params);
}

export function getExpensesByCategory(params?: { year?: number; month?: number }) {
  return get<ExpensesByCategory>("/api/stats/expenses-by-category", params);
}
