import {User, RoleEnum, Prisma, PrismaClient, ResponseEnum} from '@prisma/client';
import authService from '../services/auth-service';
import {Request, Response} from 'express';
import userService from '../services/user-service';
import { Tokens } from '../types/auth-types';
import dayOfExamsService from '../services/dayOfExams-service';
import responseService from '../services/response-service';
import { URequest } from '../types/URequest';
import envConfig from '../configs/env-config';


export default {
    register: async (req: Request, res: Response) => {
        const {firstName, lastName, email, password, role} = req.body;
        if(!email || !password || !firstName || !lastName || !role ||
            firstName === '' || lastName === '' || email === '' || password === '' || role === '') {
            return res.status(401).json({ error: 'Please fill all the fields' });
        }

        if (!(role in RoleEnum)) {
            return res.status(401).json({ error: 'Invalid role' });
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if(!emailRegex.test(email)) {
            return res.status(401).json({ error: 'Invalid email' });
        }

        const userExists = await userService.getUserByEmail(email);
        if(userExists) {
            return res.status(402).json({ error: 'Email taken' });
        }

        const hash = authService.hashPassword(password);

        const newUser = await userService.createUser({
            firstName,
            lastName,
            email,
            password: hash,
            role: role as RoleEnum,
            activatedAccount: false,
            deactivated: false,
        });

        const dayOfExams = await dayOfExamsService.getDayOfExams();
        const currentDate = new Date();
        for (let dayOfExam of dayOfExams) {
            if (dayOfExam.date > currentDate) {
                await responseService.createResponse(dayOfExam.id, newUser.id, ResponseEnum.No);
            }
        }

        return res.status(201).json({ success: 'User registered' });
    },

    login: async (req: Request, res: Response) => {
        const {email, password} = req.body;
        if(!email || !password || email === '' || password === '') {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }
    
        const user = await userService.getUserByEmail(email);
        if(!user) {
            return res.status(400).json({ error: 'Invalid email' });
        }
        
        if(authService.hashPassword(password) !== user.password) {
            return res.status(400).json({ error: 'Invalid password' });
        }
    
        const tokens : Tokens = authService.generateTokens(user);
    
        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, sameSite: 'strict', maxAge: envConfig.getEnv('EXP_REFRESH'), signed: true});
        res.cookie('accessToken', tokens.accessToken, { httpOnly: true, sameSite: 'strict', maxAge: envConfig.getEnv('EXP_ACCESS') , signed: true });
      
        const { password: pass, ...userWithoutPassword } = user;
        
        return res.status(200).json(userWithoutPassword);
    },
    
    refreshTokens: async (req: URequest, res: Response) => {
        if (!req.user || !req.user.email) {
            return res.status(400).json({ error: 'Invalid refresh token' });
        }   
    
        const user = await userService.getUserByEmail(req.user.email);
        if(!user) {
            return res.status(400).json({ error: 'Invalid refresh token' });
        }   
    
        const tokens : Tokens = authService.generateTokens(user);
    
        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, sameSite: 'strict', maxAge: envConfig.getEnv('EXP_REFRESH'), signed: true});
        res.cookie('accessToken', tokens.accessToken, { httpOnly: true, sameSite: 'strict', maxAge: envConfig.getEnv('EXP_ACCESS'), signed: true });

        const { password, ...userWithoutPassword } = user;        
        return res.status(200).json(userWithoutPassword);
    },

    logout: async (req: Request, res: Response) => {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res.status(200).json({ success: 'Logged out' });
    },
}
