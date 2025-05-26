import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import userRoutes from './modules/user/presentation/user.routes';
import { swaggerUi, swaggerSpec } from './swagger';
import { responseMiddleware } from './shared/infra/middlewares/responseMiddleware';
import { requestLogger } from './shared/infra/middlewares/requestLogger';
import { errorHandler } from './shared/infra/middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

// Log de requisições
app.use(requestLogger);

// Middleware para formatar as respostas
app.use(responseMiddleware);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use('/api', userRoutes);

// Middleware global de tratamento de erros (sempre por último)
app.use(errorHandler);

// Process-level error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
