import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TechCorp API',
      version: '1.0.0',
    },
  },
  apis: [
    path.join(__dirname, 'docs/*.yaml')
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };