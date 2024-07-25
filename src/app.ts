import cors from 'cors';
import express, { Express } from 'express';
import router from './router';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import logger from './configs/logger';
import cookieParser from 'cookie-parser';
import envConfig from './configs/env-config';
import swaggerDocs from './docs/swaggerConfig';
import upload from '../src/configs/upload-config';

const app: Express = express();

const cookieSecret = envConfig.getEnv('COOKIE_SECRET') as string;
app.use(cookieParser(cookieSecret));

app.use(cors({ origin: envConfig.getEnv('FRONTEND_URL'), credentials: true }));
app.use(express.json());

app.use(router);

const server = app.listen(4000, '0.0.0.0', () => {
    console.log('Server is running on port 4000');
});

export { app, server };