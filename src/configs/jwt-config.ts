import { SignOptions } from 'jsonwebtoken';
import envConfig from '../helpers/configs/env-config';
import { Params } from 'express-jwt';

const accessJwtSecret = envConfig.getEnv('JWT_SECRET') as Params['secret'];
const accessJwtOptions: SignOptions = {
    expiresIn: "15d", 
    algorithm: "HS256"
};

const refreshJwtSecret = envConfig.getEnv('JWT_SECRET') as Params['secret'];
const refreshJwtOptions: SignOptions = {
    expiresIn: "14d",
    algorithm: "HS256"
};

export { accessJwtOptions, accessJwtSecret, refreshJwtOptions, refreshJwtSecret };