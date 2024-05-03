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

app.use(fileUpload())
app.use(cors({origin: envConfig.getEnv('FRONTEND_URL'), credentials: true}))
app.use(express.json());
app.use(router);


app.listen(4000, '0.0.0.0', () => {
  swaggerDocs(app);
  console.log('Server is running on port 4000');
});

export default app;