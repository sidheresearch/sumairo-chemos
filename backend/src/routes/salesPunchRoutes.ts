import { Router } from 'express';
import { SalesPunchController } from '../controllers/SalesPunchController';
import { SalesPunchService } from '../services/SalesPunchService';
import { SalesPunchRepository } from '../repository/SalesPunchRepository';

const router = Router();

// Dependency wiring for this module
const punchRepo = new SalesPunchRepository();
const punchService = new SalesPunchService(punchRepo);
const punchController = new SalesPunchController(punchService);

router.get('/', punchController.getAll);
router.get('/:id', punchController.getById);
router.post('/', punchController.create);
router.patch('/:id', punchController.update);
router.delete('/:id', punchController.remove);

export default router;
