import { Router } from 'express';
import salesRoutes from './salesRoutes';
import salesPunchRoutes from './salesPunchRoutes';

const router = Router();

router.use('/sales', salesRoutes);
router.use('/sales-punch', salesPunchRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
