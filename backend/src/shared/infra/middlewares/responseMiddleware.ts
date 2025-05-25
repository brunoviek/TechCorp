import { Request, Response, NextFunction } from 'express';

export function responseMiddleware(req: Request, res: Response, next: NextFunction) {
  const oldJson = res.json;
  res.json = function (data) {
    if (data && (data.success === true || data.success === false)) {
      return oldJson.call(this, data);
    }
    if (data && data.message) {
      return oldJson.call(this, {
        success: true,
        message: data.message,
        data: { ...data, message: undefined }, 
      });
    }
    return oldJson.call(this, {
      success: true,
      data,
    });
  };
  next();
}