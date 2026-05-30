// ── Shared enums / literals ────────────────────────────────────────────────

export type AvailabilityType = 'Ready' | 'Incoming' | '';
export type MarketStatusType = 'Ready Market' | 'Incoming' | 'Spot' | '';
export type SaleType = 'GST Sale' | 'Bond Sale';

// ── Pagination / query helpers ─────────────────────────────────────────────

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface DayFilter {
  day?: string; // YYYY-MM-DD
}

// ── Generic API response wrapper ───────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ListResponse<T> {
  rows: T[];
  total?: number;
}
