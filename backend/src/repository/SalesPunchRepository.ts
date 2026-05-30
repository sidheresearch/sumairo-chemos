import { Op } from 'sequelize';
import type { SalesPunch, CreateSalesPunchDto, UpdateSalesPunchDto } from '../models/SalesPunch';
import type { IRepository, PagedResult } from './IRepository';
import { SalesPunchModel, type SalesPunchRow } from '../db/SalesPunchModel';

function toEntity(m: SalesPunchModel): SalesPunch {
  const row = m.get({ plain: true }) as SalesPunchRow;
  return {
    ...row,
    ts: row.ts instanceof Date ? row.ts.toISOString() : String(row.ts),
  } as unknown as SalesPunch;
}

/**
 * Sequelize implementation of the SalesPunch repository.
 * Schema: sumairochemos  |  Table: sales_punch
 */
export class SalesPunchRepository
  implements IRepository<SalesPunch, CreateSalesPunchDto, UpdateSalesPunchDto, { day?: string; page?: number; limit?: number }>
{
  async findAll(filter?: { day?: string; page?: number; limit?: number }): Promise<PagedResult<SalesPunch>> {
    const page   = Math.max(1, filter?.page  ?? 1);
    const limit  = Math.max(1, filter?.limit ?? 20);
    const offset = (page - 1) * limit;

    const where = filter?.day
      ? {
          ts: {
            [Op.gte]: new Date(`${filter.day}T00:00:00.000Z`),
            [Op.lt]:  new Date(`${filter.day}T23:59:59.999Z`),
          },
        }
      : {};

    const { count, rows } = await SalesPunchModel.findAndCountAll({
      where,
      order: [['ts', 'DESC']],
      limit,
      offset,
    });

    return {
      rows: rows.map(toEntity),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit) || 1,
    };
  }

  async findById(id: number): Promise<SalesPunch | null> {
    const row = await SalesPunchModel.findByPk(id);
    return row ? toEntity(row) : null;
  }

  async create(dto: CreateSalesPunchDto): Promise<SalesPunch> {
    const row = await SalesPunchModel.create({
      company_to:       dto.company_to,
      company_from:     dto.company_from,
      product:          dto.product,
      vessel_name:      dto.vessel_name      ?? '',
      shipment:         dto.shipment         ?? '',
      quantity:         dto.quantity,
      price_fc:         dto.price_fc,
      currency:         dto.currency         ?? 'USD',
      offer_usd:        dto.offer_usd,
      exchange_rate:    dto.exchange_rate    ?? 1,
      price_inr:        dto.price_inr,
      delivery_term:    dto.delivery_term    ?? '',
      payment_days:     dto.payment_days     ?? '',
      port:             dto.port,
      market_price:     dto.market_price     ?? 0,
      market_status:    dto.market_status    ?? '',
      cost_price:       dto.cost_price       ?? 0,
      replacement_cost: dto.replacement_cost ?? 0,
      make:             dto.make             ?? '',
      packaging:        dto.packaging        ?? '',
      origin:           dto.origin           ?? '',
      expense:          dto.expense          ?? 0,
      custom_duty:      dto.custom_duty      ?? 0,
      sws:              dto.sws              ?? 0,
      add:              dto.add              ?? 0,
      other_expense:    dto.other_expense    ?? 0,
    });
    return toEntity(row);
  }

  async update(id: number, dto: UpdateSalesPunchDto): Promise<SalesPunch | null> {
    const row = await SalesPunchModel.findByPk(id);
    if (!row) return null;
    await row.update(dto as Partial<SalesPunchRow>);
    return toEntity(row);
  }

  async delete(id: number): Promise<boolean> {
    const count = await SalesPunchModel.destroy({ where: { id } });
    return count > 0;
  }
}
