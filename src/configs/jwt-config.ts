import { SignOptions } from 'jsonwebtoken';
import envConfig from './env-config';
import { Params } from 'express-jwt';

const isDevelopment = envConfig.getEnv('NODE_ENV') === 'development';

const accessJwtSecret = envConfig.getEnv('JWT_SECRET') as Params['secret'];
const accessJwtOptions: SignOptions = {
    expiresIn: isDevelopment ? 'never' : (envConfig.getEnv('A_EXP') as string ?? '1h'),
    algorithm: "HS256"
};

const refreshJwtSecret = envConfig.getEnv('JWT_SECRET') as Params['secret'];
const refreshJwtOptions: SignOptions = {
    expiresIn: isDevelopment ? 'never' : (envConfig.getEnv('A_EXP_REFRESH') as string ?? '100d'),
    algorithm: "HS256"
};

export { accessJwtOptions, accessJwtSecret, refreshJwtOptions, refreshJwtSecret };