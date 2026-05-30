import type { SalesPunch, CreateSalesPunchDto, UpdateSalesPunchDto } from '../models/SalesPunch';
import type { SalesPunchRepository } from '../repository/SalesPunchRepository';
import type { PagedResult } from '../repository/IRepository';

export class SalesPunchService {
  constructor(private readonly punchRepo: SalesPunchRepository) {}

  async getAllPunches(day?: string, page?: number, limit?: number): Promise<PagedResult<SalesPunch>> {
    return this.punchRepo.findAll({ day, page, limit });
  }

  async getPunchById(id: number): Promise<SalesPunch> {
    const punch = await this.punchRepo.findById(id);
    if (!punch) {
      throw new Error(`SalesPunch with id ${id} not found`);
    }
    return punch;
  }

  async createPunch(dto: CreateSalesPunchDto): Promise<SalesPunch> {
    this.validateCreateDto(dto);
    return this.punchRepo.create(dto);
  }

  async updatePunch(id: number, dto: UpdateSalesPunchDto): Promise<SalesPunch> {
    const updated = await this.punchRepo.update(id, dto);
    if (!updated) {
      throw new Error(`SalesPunch with id ${id} not found`);
    }
    return updated;
  }

  async deletePunch(id: number): Promise<void> {
    const deleted = await this.punchRepo.delete(id);
    if (!deleted) {
      throw new Error(`SalesPunch with id ${id} not found`);
    }
  }

  private validateCreateDto(dto: CreateSalesPunchDto): void {
    const required: (keyof CreateSalesPunchDto)[] = [
      'company_to',
      'company_from',
      'product',
      'quantity',
      'offer_usd',
      'price_inr',
      'port',
    ];
    const missing = required.filter((k) => !dto[k] && dto[k] !== 0);
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
  }
}
