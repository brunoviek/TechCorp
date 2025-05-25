import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  console.log(`[ROUTE] ${req.method} ${req.originalUrl} - Body:`, req.body);
  next();
}