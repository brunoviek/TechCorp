import express, { Request, Response, NextFunction } from 'express';
import { container } from '../../../inversify.config';
import { CreateUserCommandHandler } from '../application/commands/CreateUserCommandHandler';
import { ListUsersQueryHandler } from '../application/queries/ListUsersQueryHandler';
import { EditUserCommandHandler } from '../application/commands/EditUserCommandHandler';
import { DeleteUserCommandHandler } from '../application/commands/DeleteUserCommandHandler';
import { GetUserByIdQueryHandler } from '../application/queries/GetUserByIdQueryHandler';
import { body, query } from 'express-validator';
import { validateRequest } from '../../../shared/infra/middlewares/validateRequest';
import multer from 'multer';
import path from 'path';
import { ImportUsersBatchHandler } from '../application/commands/ImportUsersBatchHandler';

const router = express.Router();
const createUserHandler = container.get(CreateUserCommandHandler);
const listUsersHandler = container.get(ListUsersQueryHandler);
const editUserHandler = container.get(EditUserCommandHandler);
const deleteUserHandler = container.get(DeleteUserCommandHandler);
const getUserByIdHandler = container.get(GetUserByIdQueryHandler);
const importUsersBatchHandler = container.get(ImportUsersBatchHandler);
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.originalname.toLowerCase().endsWith('.csv')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos CSV são permitidos!'));
    }
  },
});

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
      res.status(201).json({
        message: 'Usuário criado com sucesso',
        nome,
        email,
        idade
      });
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

router.get(
  '/users/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const user = await getUserByIdHandler.execute(id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'Usuário não encontrado',
        });
        return;
      }
      res.json({
        message: 'Usuário encontrado com sucesso',
        ...user
      });
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/users/:id',
  [
    body('nome').isString().notEmpty(),
    body('email').isEmail(),
    body('idade').isInt({ min: 0 }),
    validateRequest
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const { nome, email, idade } = req.body;
      await editUserHandler.execute(id, nome, email, idade);
      res.status(200).json({
        message: 'Usuário editado com sucesso',
        id,
        nome,
        email,
        idade
      });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/users/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      await deleteUserHandler.execute(id);
      res.status(204).json({
        message: 'Usuário excluído com sucesso'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/users/batch',
  (req, res, next) => {
    upload.single('file')(req, res, function (err) {
      if (err) {
        if (err.message === 'Apenas arquivos CSV são permitidos!') {
          return res.status(400).json({ success: false, error: err.message });
        }
        return next(err);
      }
      next();
    });
  },
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: 'Arquivo CSV não enviado' });
        return;
      }
      const filePath = path.resolve(req.file.path);
      const result = await importUsersBatchHandler.execute(filePath);
      res.json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;