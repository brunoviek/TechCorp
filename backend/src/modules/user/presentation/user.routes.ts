import express, { Request, Response, NextFunction } from 'express';
import { container } from '../../../inversify.config';
import { CreateUserCommandHandler } from '../application/commands/CreateUserCommandHandler';
import { ListUsersQueryHandler } from '../application/queries/ListUsersQueryHandler';
import { body, query } from 'express-validator';
import { validateRequest } from '../../../shared/infra/middlewares/validateRequest';

const router = express.Router();
const createUserHandler = container.get(CreateUserCommandHandler);
const listUsersHandler = container.get(ListUsersQueryHandler);

router.post(
  '/users',
  [
    body('nome').isString().notEmpty(),
    body('email').isEmail(),
    body('idade').isInt({ min: 0 }),
    validateRequest
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nome, email, idade } = req.body;
      await createUserHandler.execute(nome, email, idade);
      res.status(201).json({ nome, email, idade });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/users',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1 }),
    validateRequest
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await listUsersHandler.execute(page, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

export default router;