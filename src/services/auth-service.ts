import { User, Authorization, PrismaClient} from '@prisma/client';
import jwt, { Secret } from 'jsonwebtoken';
import crypto from 'crypto';
import passwordConfig from '../configs/password-config';
import { accessJwtOptions, accessJwtSecret, refreshJwtOptions, refreshJwtSecret} from '../configs/jwt-config';
import logger from '../configs/logger';
import envConfig from '../configs/env-config';

const prisma = new PrismaClient();

// Utility for timing-safe comparisons to prevent timing attacks
const timingSafeEqual = (a: string, b: string): boolean => {
  try {
    const buffA = Buffer.from(a, 'hex');
    const buffB = Buffer.from(b, 'hex');
    
    const maxLength = Math.max(buffA.length, buffB.length);
    const paddedA = Buffer.alloc(maxLength, 0);
    const paddedB = Buffer.alloc(maxLength, 0);
    
    buffA.copy(paddedA);
    buffB.copy(paddedB);
    
    return crypto.timingSafeEqual(paddedA, paddedB);
  } catch (error) {
    logger.error('Error in timing-safe comparison:', error);
    return false;
  }
};

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
    
    comparePassword: (plainPassword: string, hashedPassword: string): boolean => {
        const hashedAttempt = crypto.pbkdf2Sync(
            plainPassword,
            passwordConfig.salt as string,
            passwordConfig.iterations as number,
            passwordConfig.keylen as number,
            passwordConfig.digest as string
        ).toString('hex');
        
        return timingSafeEqual(hashedAttempt, hashedPassword);
    },

    deleteCode: async (userId: number) => {
        try {
            await prisma.authorization.deleteMany({
                where: {
                    userId: userId
                }
            });
        } catch (err) {
            logger.error('Error deleting authorization code:', err);
            throw new Error('Failed to delete verification code');
        }
    },

    storeCode: async (userId: number, code: string, expirationMinutes = 10) => {
        try {
            const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);
            
            const salt = crypto.randomBytes(16).toString('hex');
            
            const hashedCode = crypto.createHash('sha256')
                .update(code + salt)
                .digest('hex');
            
            await prisma.authorization.deleteMany({
                where: {
                    userId: userId
                }
            });
            
            await prisma.authorization.create({
                data: {
                    code: hashedCode,
                    userId: userId,
                    expiresAt: expiresAt,
                    metadata: JSON.stringify({ salt }) // Store the salt in metadata
                }
            });
            
            logger.info(`Stored verification code for user: ${userId}`);
        } catch (err) {
            logger.error('Error storing authorization code:', err);
            throw new Error('Failed to store verification code');
        }
    },

    verifyCode: async (userId: number, inputCode: string) => {
        try {
            const authorizations = await prisma.authorization.findMany({
                where: {
                    userId: userId
                }
            });
            
            if (authorizations.length === 0) {
                logger.info(`No verification code found for user: ${userId}`);
                return false;
            }
            
            const authorization = authorizations[0];
            
            if (authorization.expiresAt < new Date()) {
                logger.info(`Verification code expired for user: ${userId}`);
                return false;
            }
            
            const metadata = authorization.metadata ? JSON.parse(authorization.metadata) : {};
            const salt = metadata.salt || '';
            
            const hashedInput = crypto.createHash('sha256')
                .update(inputCode + salt)
                .digest('hex');
            
            const isMatch = timingSafeEqual(hashedInput, authorization.code);
            
            if (isMatch) {
                logger.info(`Verification code validated for user: ${userId}`);
            } else {
                logger.info(`Invalid verification code attempt for user: ${userId}`);
            }
            
            return isMatch;
        } catch (err) {
            logger.error('Error verifying authorization code:', err);
            return false;
        }
    },
    
    // Track failed login attempts
    trackFailedLogin: async (userId: number) => {
        try {
            const key = `failed_logins:${userId}`;
            
            // Store in database or cache
            const failedLogin = await prisma.loginAttempt.upsert({
                where: { userId },
                update: {
                    attempts: { increment: 1 },
                    lastAttempt: new Date()
                },
                create: {
                    userId,
                    attempts: 1,
                    lastAttempt: new Date()
                }
            });
            
            return failedLogin.attempts;
        } catch (error) {
            logger.error('Error tracking failed login:', error);
            return 0;
        }
    },
    
    // Reset failed login attempts
    resetFailedLogins: async (userId: number) => {
        try {
            await prisma.loginAttempt.update({
                where: { userId },
                data: { attempts: 0 }
            });
        } catch (error) {
            logger.error('Error resetting failed logins:', error);
        }
    },
    
    // Check if account is temporarily locked
    isAccountLocked: async (userId: number) => {
        try {
            const loginAttempt = await prisma.loginAttempt.findUnique({
                where: { userId }
            });
            
            if (!loginAttempt) {
                return false;
            }
            
            // Check if there are 5 or more attempts in the last 15 minutes
            const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
            return loginAttempt.attempts >= 5 && loginAttempt.lastAttempt > fifteenMinutesAgo;
        } catch (error) {
            logger.error('Error checking account lock status:', error);
            return false;
        }
    },
    
    // Check if a password has been compromised (pwned)
    isPasswordCompromised: async (password: string) => {
        try {
            // Generate the first 5 characters of the SHA-1 hash of the password
            const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
            const prefix = hash.substring(0, 5);
            const suffix = hash.substring(5);
            
            const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
            if (!response.ok) {
                throw new Error('Failed to check password against breach database');
            }
            
            const text = await response.text();
            const lines = text.split('\n');
            
            return lines.some(line => line.split(':')[0] === suffix);
        } catch (error) {
            logger.error('Error checking password breach:', error);
            return false; 
        }
    }
}