import type { MarketStatusType, SaleType } from '../types';

export interface Sale {
  id: number;
  ts: string;
  sale_type: SaleType;
  company_to: string;
  company_from: string;
  product: string;
  quantity: number;
  price: number;
  payment: string;
  delivery_term: string;
  port: string;
  market_price: number;
  market_status: MarketStatusType;
  storage_days: number;
  make: string;
  packaging: string;
  origin: string;
  transit_tolerance: string;
  message: string;
}

export interface CreateSaleDto {
  sale_type?: SaleType;
  company_to: string;
  company_from: string;
  product: string;
  quantity: number;
  price: number;
  payment?: string;
  delivery_term?: string;
  port: string;
  market_price?: number;
  market_status?: MarketStatusType;
  storage_days?: number;
  make?: string;
  packaging?: string;
  origin?: string;
  transit_tolerance?: string;
  message?: string;
}

export interface UpdateSaleDto extends Partial<CreateSaleDto> {}
