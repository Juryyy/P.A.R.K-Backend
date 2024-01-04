import { User } from '@prisma/client';
import jwt, { Secret } from 'jsonwebtoken';
import crypto from 'crypto';
import passwordConfig from '../configs/password-config';
import { accessJwtOptions, accessJwtSecret, refreshJwtOptions, refreshJwtSecret} from '../configs/jwt-config';



export default {
    generateTokens: (user: User) => {
        const { password, ...userWithoutPassword } = user;
        const tokenPayload = { ...userWithoutPassword };

        const accessToken = jwt.sign(
            tokenPayload,
            accessJwtSecret as Secret,
            accessJwtOptions
        );

        const refreshToken = jwt.sign(
            tokenPayload,
            refreshJwtSecret as Secret,
            refreshJwtOptions
        );

        return { accessToken, refreshToken };
    },
    hashPassword: (password: string) => {
        return crypto.pbkdf2Sync(
            password,
            passwordConfig.salt as string,
            passwordConfig.iterations as number,
            passwordConfig.keylen as number,
            passwordConfig.digest as string
        ).toString('hex');
    }
}