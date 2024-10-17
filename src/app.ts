import cors from 'cors';
import express, { Express } from 'express';
import router from './router';
import cookieParser from 'cookie-parser';
import envConfig from './configs/env-config';
import { scheduleAllTasks } from './scheduler/scheduler';

const app: Express = express();

const cookieSecret = envConfig.getEnv('COOKIE_SECRET') as string;
app.use(cookieParser(cookieSecret));

const frontendUrl = envConfig.getEnv('FRONTEND_URL') as string;
app.use(cors({ 
  origin: frontendUrl, 
  credentials: true 
}));
app.use(express.json());
scheduleAllTasks();

app.use('/api', router);

const port = Number(envConfig.getEnv('PORT')) || 4000;
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://194.182.77.166:${port}`);
});

export { app, server };