import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { logError } from '../decorators/logError';

export const validateRequest: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logError('ValidationError', errors.array());
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
    return;
  }
  return next();
};