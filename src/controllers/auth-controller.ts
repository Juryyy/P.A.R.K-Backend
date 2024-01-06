import {User, RoleEnum, Prisma, PrismaClient} from '@prisma/client';
import authService from '../services/auth-service';
import {Request, Response} from 'express';
import userService from '../services/user-service';
import { Tokens } from '../types/auth-types';

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

        await userService.createUser({
            firstName,
            lastName,
            email,
            password: hash,
            role: role as RoleEnum,
            activatedAccount: false, 
        });


        return res.status(201).json({ success: 'User created' });
},
    login: async (req: Request, res: Response) => {
        const {email, password} = req.body;
        if(!email || !password || email === '' || password === '') {
            return res.status(401).json({ error: 'Please fill all the fields' });
        }

        const user = await userService.getUserByEmail(email);
        if(!user) {
            return res.status(401).json({ error: 'Invalid email' });
        }
        
        if(authService.hashPassword(password) !== user.password) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const tokens : Tokens = authService.generateTokens(user);
        return res.status(200).json({ tokens });
    },

    refreshTokens: async (req: Request & { user?: User }, res: Response) => {
        if (!req.user || !req.user.email) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }   

        const user = await userService.getUserByEmail(req.user.email);
        if(!user) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }   

        const tokens : Tokens = authService.generateTokens(user);
        return res.status(200).json({ tokens });
    }
}
