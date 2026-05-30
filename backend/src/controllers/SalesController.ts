import type { Request, Response, NextFunction } from 'express';
import type { SalesService } from '../services/SalesService';
import type { CreateSaleDto, UpdateSaleDto } from '../models/Sale';

export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  /**
   * GET /api/sales?day=YYYY-MM-DD
   */
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const day   = req.query.day   as string | undefined;
      const page  = req.query.page  ? Number(req.query.page)  : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const result = await this.salesService.getAllSales(day, page, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/sales/:id
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const sale = await this.salesService.getSaleById(id);
      res.json({ data: sale });
    } catch (err) {
      next(err);
    }
  };

  /**
   * POST /api/sales
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateSaleDto;
      const sale = await this.salesService.createSale(dto);
      res.status(201).json({ data: sale });
    } catch (err) {
      next(err);
    }
  };

  /**
   * PATCH /api/sales/:id
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const dto = req.body as UpdateSaleDto;
      const sale = await this.salesService.updateSale(id, dto);
      res.json({ data: sale });
    } catch (err) {
      next(err);
    }
  };

  /**
   * DELETE /api/sales/:id
   */
  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      await this.salesService.deleteSale(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
