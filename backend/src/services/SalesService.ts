import type { Sale, CreateSaleDto, UpdateSaleDto } from '../models/Sale';
import type { SalesRepository } from '../repository/SalesRepository';
import type { PagedResult } from '../repository/IRepository';

export class SalesService {
  constructor(private readonly salesRepo: SalesRepository) {}

  async getAllSales(day?: string, page?: number, limit?: number): Promise<PagedResult<Sale>> {
    return this.salesRepo.findAll({ day, page, limit });
  }

  async getSaleById(id: number): Promise<Sale> {
    const sale = await this.salesRepo.findById(id);
    if (!sale) {
      throw new Error(`Sale with id ${id} not found`);
    }
    return sale;
  }

  async createSale(dto: CreateSaleDto): Promise<Sale> {
    this.validateCreateDto(dto);
    return this.salesRepo.create(dto);
  }

  async updateSale(id: number, dto: UpdateSaleDto): Promise<Sale> {
    const updated = await this.salesRepo.update(id, dto);
    if (!updated) {
      throw new Error(`Sale with id ${id} not found`);
    }
    return updated;
  }

  async deleteSale(id: number): Promise<void> {
    const deleted = await this.salesRepo.delete(id);
    if (!deleted) {
      throw new Error(`Sale with id ${id} not found`);
    }
  }

  private validateCreateDto(dto: CreateSaleDto): void {
    const required: (keyof CreateSaleDto)[] = [
      'company_to',
      'company_from',
      'product',
      'quantity',
      'price',
      'port',
    ];
    const missing = required.filter((k) => !dto[k] && dto[k] !== 0);
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
  }
}
