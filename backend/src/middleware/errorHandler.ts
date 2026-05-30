import type { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? 'Internal Server Error';

  // Determine if this is a "not found" error
  if (message.toLowerCase().includes('not found')) {
    res.status(404).json({ success: false, error: message });
    return;
  }

  // Validation / bad request
  if (message.toLowerCase().includes('missing required')) {
    res.status(400).json({ success: false, error: message });
    return;
  }

  res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : message,
  });
}
