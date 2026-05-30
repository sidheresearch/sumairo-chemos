import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

const SCHEMA = process.env.DB_SCHEMA ?? 'sumairochemos';

export interface SalesPunchRow {
  id: number;
  ts: Date;
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
  market_status: string;
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

type SalesPunchCreation = Optional<SalesPunchRow, 'id' | 'ts'>;

export class SalesPunchModel
  extends Model<SalesPunchRow, SalesPunchCreation>
  implements SalesPunchRow
{
  declare id: number;
  declare ts: Date;
  declare company_to: string;
  declare company_from: string;
  declare product: string;
  declare vessel_name: string;
  declare shipment: string;
  declare quantity: number;
  declare price_fc: number;
  declare currency: string;
  declare offer_usd: number;
  declare exchange_rate: number;
  declare price_inr: number;
  declare delivery_term: string;
  declare payment_days: string;
  declare port: string;
  declare market_price: number;
  declare market_status: string;
  declare cost_price: number;
  declare replacement_cost: number;
  declare make: string;
  declare packaging: string;
  declare origin: string;
  declare expense: number;
  declare custom_duty: number;
  declare sws: number;
  declare add: number;
  declare other_expense: number;
}

SalesPunchModel.init(
  {
    id:               { type: DataTypes.INTEGER,  autoIncrement: true, primaryKey: true },
    ts:               { type: DataTypes.DATE,     defaultValue: DataTypes.NOW },
    company_to:       { type: DataTypes.STRING,   allowNull: false },
    company_from:     { type: DataTypes.STRING,   allowNull: false },
    product:          { type: DataTypes.STRING,   allowNull: false },
    vessel_name:      { type: DataTypes.STRING,   defaultValue: '' },
    shipment:         { type: DataTypes.STRING,   defaultValue: '' },
    quantity:         { type: DataTypes.FLOAT,    allowNull: false },
    price_fc:         { type: DataTypes.FLOAT,    defaultValue: 0 },
    currency:         { type: DataTypes.STRING,   defaultValue: 'USD' },
    offer_usd:        { type: DataTypes.FLOAT,    allowNull: false },
    exchange_rate:    { type: DataTypes.FLOAT,    defaultValue: 1 },
    price_inr:        { type: DataTypes.FLOAT,    allowNull: false },
    delivery_term:    { type: DataTypes.STRING,   defaultValue: '' },
    payment_days:     { type: DataTypes.STRING,   defaultValue: '' },
    port:             { type: DataTypes.STRING,   allowNull: false },
    market_price:     { type: DataTypes.FLOAT,    defaultValue: 0 },
    market_status:    { type: DataTypes.STRING,   defaultValue: '' },
    cost_price:       { type: DataTypes.FLOAT,    defaultValue: 0 },
    replacement_cost: { type: DataTypes.FLOAT,    defaultValue: 0 },
    make:             { type: DataTypes.STRING,   defaultValue: '' },
    packaging:        { type: DataTypes.STRING,   defaultValue: '' },
    origin:           { type: DataTypes.STRING,   defaultValue: '' },
    expense:          { type: DataTypes.FLOAT,    defaultValue: 0 },
    custom_duty:      { type: DataTypes.FLOAT,    defaultValue: 0 },
    sws:              { type: DataTypes.FLOAT,    defaultValue: 0 },
    add:              { type: DataTypes.FLOAT,    defaultValue: 0 },
    other_expense:    { type: DataTypes.FLOAT,    defaultValue: 0 },
  },
  {
    sequelize,
    tableName: 'sales_punch',
    schema: SCHEMA,
    timestamps: false,
  }
);
