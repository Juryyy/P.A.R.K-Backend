import cors from 'cors';
import express, { Express } from 'express';
import router from './router';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';


const tokenFilePath = '../back-end/token.json';
const app: Express = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Calendar Backend API',
      version: '1.0.0',
    },
  },
  apis: ['./src/router.ts'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use(cors());

app.use(express.json());

app.use(router);

app.listen(4000, () => {
  console.log('Server running on port 4000');
});

export default app;