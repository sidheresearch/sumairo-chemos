import type { MarketStatusType } from '../types';

export interface SalesPunch {
  id: number;
  ts: string;
  company_to: string;
  company_from: string;
  product: string;
  vessel_name: string;
  shipment: string;
  quantity: number;
  price_fc: number;
  currency: string;
  offer_usd: number;
  exchange_rate: number;
  price_inr: number;
  delivery_term: string;
  payment_days: string;
  port: string;
  market_price: number;
  market_status: MarketStatusType;
  cost_price: number;
  replacement_cost: number;
  make: string;
  packaging: string;
  origin: string;
  expense: number;
  custom_duty: number;
  sws: number;
  add: number;
  other_expense: number;
}

export interface CreateSalesPunchDto {
  company_to: string;
  company_from: string;
  product: string;
  vessel_name?: string;
  shipment?: string;
  quantity: number;
  price_fc: number;
  currency?: string;
  offer_usd: number;
  exchange_rate?: number;
  price_inr: number;
  delivery_term?: string;
  payment_days?: string;
  port: string;
  market_price?: number;
  market_status?: MarketStatusType;
  cost_price?: number;
  replacement_cost?: number;
  make?: string;
  packaging?: string;
  origin?: string;
  expense?: number;
  custom_duty?: number;
  sws?: number;
  add?: number;
  other_expense?: number;
}

export interface UpdateSalesPunchDto extends Partial<CreateSalesPunchDto> {}
