import type {
  FeedOptions,
  SalePunchPayload,
  CreatePunchResponse,
  PunchListResponse,
  SaleFormPayload,
  CreateSaleResponse,
  SaleListResponse,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';

export async function fetchFeedOptions(): Promise<FeedOptions> {
  const res = await fetch(`${API_BASE}/api/feed-options`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch feed options');
  return res.json();
}

/** day = YYYY-MM-DD, page/limit for pagination */
export async function fetchTodayPunches(
  day: string,
  page = 1,
  limit = 20
): Promise<PunchListResponse> {
  const params = new URLSearchParams({ day, page: String(page), limit: String(limit) });
  const res = await fetch(`${API_BASE}/api/feed/sales_punch?${params}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch punches');
  return res.json();
}

export async function createPunch(
  payload: SalePunchPayload
): Promise<CreatePunchResponse> {
  const res = await fetch(`${API_BASE}/api/feed/sales_punch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? 'Submission failed');
  return data;
}

export async function deletePunch(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/feed/sales_punch/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Delete failed');
}

/** day = YYYY-MM-DD, page/limit for pagination */
export async function fetchTodaySales(
  day: string,
  page = 1,
  limit = 20
): Promise<SaleListResponse> {
  const params = new URLSearchParams({ day, page: String(page), limit: String(limit) });
  const res = await fetch(`${API_BASE}/api/feed/sales?${params}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch sales');
  return res.json();
}

export async function createSale(
  payload: SaleFormPayload
): Promise<CreateSaleResponse> {
  const res = await fetch(`${API_BASE}/api/feed/sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? 'Submission failed');
  return data;
}

export async function deleteSale(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/feed/sales/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Delete failed');
}
