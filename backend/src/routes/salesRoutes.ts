import { Router } from 'express';
import { SalesController } from '../controllers/SalesController';
import { SalesService } from '../services/SalesService';
import { SalesRepository } from '../repository/SalesRepository';

const router = Router();

// Dependency wiring for this module
const salesRepo = new SalesRepository();
const salesService = new SalesService(salesRepo);
const salesController = new SalesController(salesService);

router.get('/', salesController.getAll);
router.get('/:id', salesController.getById);
router.post('/', salesController.create);
router.patch('/:id', salesController.update);
router.delete('/:id', salesController.remove);

export default router;
