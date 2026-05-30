import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from '../middleware/errorHandler';
import apiRoutes from '../routes';

export function createApp() {
  const app = express();

  // ── Security & parsing middleware ────────────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ── API routes ────────────────────────────────────────────────────────────
  app.use('/api', apiRoutes);

  // ── 404 handler ──────────────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
  });

  // ── Global error handler ──────────────────────────────────────────────────
  app.use(errorHandler);

  return app;
}
