import cors from 'cors';
import express, { Express } from 'express';
import router from './router';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import logger from './configs/logger';
import cookieParser from 'cookie-parser';
import envConfig from './configs/env-config';
import swaggerDocs from './docs/swaggerConfig';
import fileUpload from 'express-fileupload';


const tokenFilePath = '../back-end/token.json';
const app: Express = express();

const cookieSecret = envConfig.getEnv('COOKIE_SECRET') as string;
app.use(cookieParser(cookieSecret));

const frontendUrl = envConfig.getEnv('FRONTEND_URL') as string;
app.use(fileUpload());
app.use(cors({origin: frontendUrl, credentials: true}));
app.use(express.json());
app.use(router);


const port = Number(envConfig.getEnv('PORT')) || 4000;
const server = app.listen(port, 'localhost', () => {
    console.log(`Server is running on http://localhost:${port}`);
});


export {app, server};
