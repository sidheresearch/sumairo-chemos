import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

const SCHEMA = process.env.DB_SCHEMA ?? 'sumairochemos';

export interface SaleRow {
  id: number;
  ts: Date;
  sale_type: string;
  company_to: string;
  company_from: string;
  product: string;
  quantity: number;
  price: number;
  payment: string;
  delivery_term: string;
  port: string;
  market_price: number;
  market_status: string;
  storage_days: number;
  make: string;
  packaging: string;
  origin: string;
  transit_tolerance: string;
  message: string;
}

type SaleCreation = Optional<SaleRow, 'id' | 'ts'>;

export class SaleModel
  extends Model<SaleRow, SaleCreation>
  implements SaleRow
{
  declare id: number;
  declare ts: Date;
  declare sale_type: string;
  declare company_to: string;
  declare company_from: string;
  declare product: string;
  declare quantity: number;
  declare price: number;
  declare payment: string;
  declare delivery_term: string;
  declare port: string;
  declare market_price: number;
  declare market_status: string;
  declare storage_days: number;
  declare make: string;
  declare packaging: string;
  declare origin: string;
  declare transit_tolerance: string;
  declare message: string;
}

SaleModel.init(
  {
    id:           { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ts:           { type: DataTypes.DATE,    defaultValue: DataTypes.NOW },
    sale_type:    { type: DataTypes.STRING,  defaultValue: 'GST Sale' },
    company_to:   { type: DataTypes.STRING,  allowNull: false },
    company_from: { type: DataTypes.STRING,  allowNull: false },
    product:      { type: DataTypes.STRING,  allowNull: false },
    quantity:     { type: DataTypes.FLOAT,   allowNull: false },
    price:        { type: DataTypes.FLOAT,   allowNull: false },
    payment:      { type: DataTypes.STRING,  defaultValue: '' },
    delivery_term:{ type: DataTypes.STRING,  defaultValue: '' },
    port:         { type: DataTypes.STRING,  allowNull: false },
    market_price: { type: DataTypes.FLOAT,   defaultValue: 0 },
    market_status:{ type: DataTypes.STRING,  defaultValue: '' },
    storage_days: { type: DataTypes.INTEGER, defaultValue: 0 },
    make:              { type: DataTypes.STRING,  defaultValue: '' },
    packaging:         { type: DataTypes.STRING,  defaultValue: '' },
    origin:            { type: DataTypes.STRING,  defaultValue: '' },
    transit_tolerance: { type: DataTypes.STRING,  defaultValue: '' },
    message:           { type: DataTypes.TEXT,    defaultValue: '' },
  },
  {
    sequelize,
    tableName: 'sales',
    schema: SCHEMA,
    timestamps: false,
  }
);
