import type { Request, Response, NextFunction } from 'express';
import type { SalesPunchService } from '../services/SalesPunchService';
import type { CreateSalesPunchDto, UpdateSalesPunchDto } from '../models/SalesPunch';

export class SalesPunchController {
  constructor(private readonly punchService: SalesPunchService) {}

  /**
   * GET /api/sales-punch?day=YYYY-MM-DD
   */
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const day   = req.query.day   as string | undefined;
      const page  = req.query.page  ? Number(req.query.page)  : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const result = await this.punchService.getAllPunches(day, page, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/sales-punch/:id
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const punch = await this.punchService.getPunchById(id);
      res.json({ data: punch });
    } catch (err) {
      next(err);
    }
  };

  /**
   * POST /api/sales-punch
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateSalesPunchDto;
      const punch = await this.punchService.createPunch(dto);
      res.status(201).json({ data: punch });
    } catch (err) {
      next(err);
    }
  };

  /**
   * PATCH /api/sales-punch/:id
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const dto = req.body as UpdateSalesPunchDto;
      const punch = await this.punchService.updatePunch(id, dto);
      res.json({ data: punch });
    } catch (err) {
      next(err);
    }
  };

  /**
   * DELETE /api/sales-punch/:id
   */
  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      await this.punchService.deletePunch(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
