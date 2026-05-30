import { Op } from 'sequelize';
import type { Sale, CreateSaleDto, UpdateSaleDto } from '../models/Sale';
import type { IRepository, PagedResult } from './IRepository';
import { SaleModel, type SaleRow } from '../db/SaleModel';

function toEntity(m: SaleModel): Sale {
  const row = m.get({ plain: true }) as SaleRow;
  return {
    ...row,
    ts: row.ts instanceof Date ? row.ts.toISOString() : String(row.ts),
  } as unknown as Sale;
}

/**
 * Sequelize implementation of the Sales repository.
 * Schema: sumairochemos  |  Table: sales
 */
export class SalesRepository
  implements IRepository<Sale, CreateSaleDto, UpdateSaleDto, { day?: string; page?: number; limit?: number }>
{
  async findAll(filter?: { day?: string; page?: number; limit?: number }): Promise<PagedResult<Sale>> {
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

    const { count, rows } = await SaleModel.findAndCountAll({
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

  async findById(id: number): Promise<Sale | null> {
    const row = await SaleModel.findByPk(id);
    return row ? toEntity(row) : null;
  }

  async create(dto: CreateSaleDto): Promise<Sale> {
    const row = await SaleModel.create({
      sale_type:         dto.sale_type         ?? 'GST Sale',
      company_to:        dto.company_to,
      company_from:      dto.company_from,
      product:           dto.product,
      quantity:          dto.quantity,
      price:             dto.price,
      payment:           dto.payment           ?? '',
      delivery_term:     dto.delivery_term     ?? '',
      port:              dto.port,
      market_price:      dto.market_price      ?? 0,
      market_status:     dto.market_status     ?? '',
      storage_days:      dto.storage_days      ?? 0,
      make:              dto.make              ?? '',
      packaging:         dto.packaging         ?? '',
      origin:            dto.origin            ?? '',
      transit_tolerance: dto.transit_tolerance ?? '',
      message:           dto.message           ?? '',
    });
    return toEntity(row);
  }

  async update(id: number, dto: UpdateSaleDto): Promise<Sale | null> {
    const row = await SaleModel.findByPk(id);
    if (!row) return null;
    await row.update(dto as Partial<SaleRow>);
    return toEntity(row);
  }

  async delete(id: number): Promise<boolean> {
    const count = await SaleModel.destroy({ where: { id } });
    return count > 0;
  }
}
