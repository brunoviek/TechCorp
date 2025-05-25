import express from 'express';
import { container } from '../../../inversify.config';
import { CreateUserCommandHandler } from '../application/commands/CreateUserCommandHandler';

const router = express.Router();
const createUserHandler = container.get(CreateUserCommandHandler);

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Cria um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               idade:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Usuário criado
 */
router.post('/users', async (req, res, next) => {
  try {
    const { nome, email, idade } = req.body;
    await createUserHandler.execute(nome, email, idade);
    res.status(201).send({ message: 'User created' });
  } catch (err) {
    next(err);
  }
});

export default router;
