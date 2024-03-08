import cors from 'cors';
import express, { Express } from 'express';
import router from './router';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import logger from './configs/logger';
import cookieParser from 'cookie-parser';
import envConfig from './configs/env-config';
import swaggerConfig from "./docs/swagger";


const tokenFilePath = '../back-end/token.json';
const app: Express = express();

const cookieSecret = envConfig.getEnv('COOKIE_SECRET') as string;
app.use(cookieParser(cookieSecret));

//app.use(cors({
//  origin: 'http://localhost:8080', // replace with your client's origin
//  credentials: true
//}));
app.use(cors({origin: 'http://localhost:8080', credentials: true}))
app.use(express.json());
app.use(router);


app.listen(4000, '0.0.0.0', () => {
  swaggerConfig(app);
  console.log('Server is running on port 4000');
});

export default app;