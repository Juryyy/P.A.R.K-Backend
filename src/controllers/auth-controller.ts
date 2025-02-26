import authService from '../services/auth-service';
import {Request, Response} from 'express';
import userService from '../services/user-service';
import { Tokens } from '../types/auth-types';
import { URequest } from '../types/URequest';
import envConfig from '../configs/env-config';
import {sendCode, sendPassword} from '../middlewares/azure-email-middleware';
import { generateSecurePassword } from '../helpers/password-generator';
import { createToken } from '../configs/token-config';
import { userActivationSchema } from '../helpers/Schemas/user-schema';
import logger from '../configs/logger';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcrypt';

// Rate limiter for sensitive endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: { error: 'Too many login attempts, please try again later' }
});

export default {
    login: async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body;
            if(!email || !password || email === '' || password === '') {
                return res.status(400).json({ error: 'Please fill all the fields' });
            }
        
            const user = await userService.getUserByEmail(email);
            if(!user) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }
            
            const passwordValid = await bcrypt.compare(password, user.password);
            if(!passwordValid) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }
        
            const tokens : Tokens = authService.generateTokens(user);
        
            res.cookie('refreshToken', tokens.refreshToken, { 
                httpOnly: true, 
                sameSite: 'strict', 
                maxAge: envConfig.getEnv('EXP_REFRESH'), 
                signed: true,
                secure: process.env.NODE_ENV === 'production'
            });
            
            res.cookie('accessToken', tokens.accessToken, { 
                httpOnly: true, 
                sameSite: 'strict', 
                maxAge: envConfig.getEnv('EXP_ACCESS'), 
                signed: true,
                secure: process.env.NODE_ENV === 'production' 
            });
          
            const { password: pass, ...userWithoutPassword } = user;
            
            logger.info(`User logged in: ${user.id}`);
            
            return res.status(200).json(userWithoutPassword);
        } catch (error) {
            logger.error('Login error:', error);
            return res.status(500).json({ error: 'An error occurred during login' });
        }
    },

    tfalogin: async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body;
            if(!email || !password || email === '' || password === '') {
                return res.status(400).json({ error: 'Please fill all the fields' });
            }
        
            const user = await userService.getUserByEmail(email);
            if(!user) {
                // Generic error for security
                return res.status(400).json({ error: 'Invalid credentials' });
            }
            
            // Check if account is locked
            const isLocked = await authService.isAccountLocked(user.id);
            if (isLocked) {
                logger.warn(`Login attempt on locked account: ${user.id}`);
                return res.status(429).json({ 
                    error: 'Too many failed login attempts. Account is temporarily locked. Please try again later or reset your password.' 
                });
            }
            
            const passwordValid = await bcrypt.compare(password, user.password);
            if(!passwordValid) {
                await authService.trackFailedLogin(user.id);
                logger.warn(`Failed login attempt for user: ${user.id}`);
                return res.status(400).json({ error: 'Invalid credentials' });
            }
            
            await authService.resetFailedLogins(user.id);
        
            const code = Math.floor(10000000 + Math.random() * 90000000).toString();
    
            await authService.storeCode(user.id, code, 10);
            await sendCode(email, 'P.A.R.K Exams center 2FA code', code, user.firstName, user.lastName);
    
            logger.info(`2FA code sent to user: ${user.id}`);
    
            return res.status(200).json({ message: 'A verification code has been sent to your email.' });
        } catch (error) {
            logger.error('2FA login error:', error);
            return res.status(500).json({ error: 'An error occurred during authentication' });
        }
    },

    verify: async (req: Request, res: Response) => {
        try {
            const {email, code} = req.body;

            const user = await userService.getUserByEmail(email);
            if(!user) {
                return res.status(400).json({ error: 'Invalid request' });
            }

            const isValid = await authService.verifyCode(user.id, code);
            if (!isValid) {
                return res.status(400).json({ error: 'Invalid or expired code' });
            }

            await authService.deleteCode(user.id);

            const tokens : Tokens = authService.generateTokens(user);
        
            res.cookie('refreshToken', tokens.refreshToken, { 
                httpOnly: true, 
                sameSite: 'strict', 
                maxAge: envConfig.getEnv('EXP_REFRESH'), 
                signed: true, 
                secure: process.env.NODE_ENV === 'production'
            });
            
            res.cookie('accessToken', tokens.accessToken, { 
                httpOnly: true, 
                sameSite: 'strict', 
                maxAge: envConfig.getEnv('EXP_ACCESS'), 
                signed: true, 
                secure: process.env.NODE_ENV === 'production'
            });
          
            const { password: pass, ...userWithoutPassword } = user;
            
            logger.info(`User verified with 2FA: ${user.id}`);
            
            return res.status(200).json(userWithoutPassword);
        } catch (error) {
            logger.error('2FA verification error:', error);
            return res.status(500).json({ error: 'An error occurred during verification' });
        }
    },

    refreshTokens: async (req: URequest, res: Response) => {
        try {
            if (!req.user || !req.user.email) {
                return res.status(400).json({ error: 'Invalid refresh token' });
            }   
        
            const user = await userService.getUserByEmail(req.user.email);
            if(!user) {
                return res.status(400).json({ error: 'Invalid refresh token' });
            }   
        
            const tokens : Tokens = authService.generateTokens(user);
        
            res.cookie('refreshToken', tokens.refreshToken, { 
                httpOnly: true, 
                sameSite: 'strict', 
                maxAge: envConfig.getEnv('EXP_REFRESH'), 
                signed: true, 
                secure: process.env.NODE_ENV === 'production'
            });
            
            res.cookie('accessToken', tokens.accessToken, { 
                httpOnly: true, 
                sameSite: 'strict', 
                maxAge: envConfig.getEnv('EXP_ACCESS'), 
                signed: true, 
                secure: process.env.NODE_ENV === 'production'
            });

            const { password, ...userWithoutPassword } = user;        
            return res.status(200).json(userWithoutPassword);
        } catch (error) {
            logger.error('Token refresh error:', error);
            return res.status(500).json({ error: 'An error occurred during token refresh' });
        }
    },

    logout: async (req: URequest, res: Response) => {
        try {          
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return res.status(200).json({ success: 'Logged out' });
        } catch (error) {
            logger.error('Logout error:', error);
            return res.status(500).json({ error: 'An error occurred during logout' });
        }
    },

    passwordUpdate: async (req: URequest, res: Response) => {
        try {
            const {password, newPassword} = req.body;
            const userId = req.user?.id;
        
            if (!userId) {
                return res.status(401).json({ error: 'Please login' });
            }
        
            if(!password || !newPassword || password === '' || newPassword === '') {
                return res.status(400).json({ error: 'Please fill all the fields' });
            }
            
            if (newPassword.length < 8) {
                return res.status(400).json({ error: 'Password must be at least 8 characters long' });
            }
            
            const hasUpperCase = /[A-Z]/.test(newPassword);
            const hasLowerCase = /[a-z]/.test(newPassword);
            const hasNumbers = /\d/.test(newPassword);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
            
            if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
                return res.status(400).json({ 
                    error: 'Password must contain uppercase, lowercase, numbers, and special characters' 
                });
            }
            
            const user = await userService.getUserById(userId);

            if(!user) {
                return res.status(400).json({ error: 'Invalid user' });
            }

            const passwordValid = await bcrypt.compare(password, user.password);
            if(!passwordValid) {
                return res.status(400).json({ error: 'Current password is incorrect' });
            }

            const salt = await bcrypt.genSalt(12);
            const newHash = await bcrypt.hash(newPassword, salt);

            await userService.updatePassword(userId, newHash);

            logger.info(`Password updated for user: ${userId}`);

            return res.status(200).json({ message: 'Password updated' });
        } catch (error) {
            logger.error('Password update error:', error);
            return res.status(500).json({ error: 'An error occurred during password update' });
        }
    },

    passwordReset: async (req: Request, res: Response) => {
        try {
            const {email} = req.body;
        
            if(!email || email === '') {
                return res.status(400).json({ error: 'Please fill all the fields' });
            }
        
            const user = await userService.getUserByEmail(email);
            if(!user) {
                return res.status(200).json({ 
                    message: 'If your email is registered, a password reset link will be sent.' 
                });
            }
        
            await authService.resetFailedLogins(user.id);
            
            const password = generateSecurePassword(24);
    
            if (!password) {
                return res.status(500).json({ error: 'Error generating password' });
            }
        
            if (await authService.isPasswordCompromised(password)) {
                const newPassword = generateSecurePassword(32);
                if (!newPassword) {
                    return res.status(500).json({ error: 'Error generating secure password' });
                }
                
                const salt = await bcrypt.genSalt(12);
                const hash = await bcrypt.hash(newPassword, salt);
                
                await userService.updatePassword(user.id, hash);
                await sendPassword(email, 'P.A.R.K Exams center password reset code', newPassword, user.firstName, user.lastName);
            } else {
                const salt = await bcrypt.genSalt(12);
                const hash = await bcrypt.hash(password, salt);
                
                await userService.updatePassword(user.id, hash);
                await sendPassword(email, 'P.A.R.K Exams center password reset code', password, user.firstName, user.lastName);
            }
        
            logger.info(`Password reset for user: ${user.id}`);
            
            return res.status(200).json({ 
                message: 'If your email is registered, a password reset link will be sent.' 
            });
        } catch (error) {
            logger.error('Password reset error:', error);
            return res.status(500).json({ error: 'An error occurred during password reset' });
        }
    },

    token: async (req: URequest, res: Response) => {
        try {
            if (!req.user || !req.user.email) {
                return res.status(400).json({ error: 'Invalid access token' });
            }   

            let user = await userService.getUserByEmail(req.user.email);
            if(!user) {
                return res.status(400).json({ error: 'Invalid access token' });
            }  

            try {
                const activationData = {
                    phone: user.phone,
                    email: user.email,
                    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
                    totaraDate: user.totaraDate ? new Date(user.totaraDate) : null,
                    totaraDone: Boolean(user.totaraDone),
                    passwordUpdated: Boolean(user.passwordUpdated)
                };

          
                const result = userActivationSchema.safeParse(activationData);

                if(result.success){
                    await userService.activateAccount(user.id);
                    user.activatedAccount = true;
                    logger.info(`Account activated for user: ${user.id}`);
                }

            } catch(error) {
                logger.error('Account activation error:', error);
            }
            
            const { password, ...userWithoutPassword } = user;    
            
            const tokenSecret = process.env.JWT_SECRET || envConfig.getEnv('JWT_SECRET') || 'defaultSecret';
            const token = createToken(userWithoutPassword, tokenSecret, '24h');
            return res.status(200).json(token);
        } catch (error) {
            logger.error('Token generation error:', error);
            return res.status(500).json({ error: 'An error occurred during token generation' });
        }
    },
}