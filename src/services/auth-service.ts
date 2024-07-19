import { User, Authorization, PrismaClient} from '@prisma/client';
import jwt, { Secret } from 'jsonwebtoken';
import crypto from 'crypto';
import passwordConfig from '../configs/password-config';
import { accessJwtOptions, accessJwtSecret, refreshJwtOptions, refreshJwtSecret} from '../configs/jwt-config';
import logger from '../configs/logger';

const prisma = new PrismaClient();

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
    },

    deleteCode: async (userId : number) => {
        try{
            await prisma.authorization.deleteMany({
                where: {
                    userId: userId
                }
            });
        }catch(err){
            logger.error(err);
        }
    },

    storeCode: async (userId : number, code : string) => {
        const expiresAt = new Date().getTime() + 10 * 60 * 1000;
        try{
            await prisma.authorization.deleteMany({
                where: {
                    userId: userId
                }
            });
        await prisma.authorization.create({
            data: {
                code: code,
                userId: userId,
                expiresAt: new Date(expiresAt)
            }
        });
        }catch(err){
            logger.error(err);
        }
    },

    verifyCode: async (userId : number, code : string) => {
        try{
            const authorization : Authorization | null = await prisma.authorization.findFirst({
                where: {
                    userId: userId,
                    code: code
                }
            });

            if(authorization){
                if(authorization.expiresAt > new Date())
                {
                    await prisma.authorization.delete({
                        where: {
                            id: authorization.id
                        }
                    });
                    return true;
            }
        }
        }catch(err){
            logger.error(err);
        }
        return false;
    },


}