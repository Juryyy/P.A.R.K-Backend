import {User, Role, Prisma, PrismaClient} from '@prisma/client';
import authService from '../services/auth-service';
import {Request, Response} from 'express';
import userService from '../services/user-service';

export default {
    register: async (req: Request, res: Response) => {
        const {firstName, lastName, email, password, role} = req.body;
        if(!email || !password || !firstName || !lastName || !role ||
            firstName === '' || lastName === '' || email === '' || password === '' || role === '') {
            return res.status(401).json({ error: 'Please fill all the fields' });
        }

        if (!(role in Role)) {
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
            id: 0, 
            firstName,
            lastName,
            email,
            password: hash,
            role: role as Role,
            drivingLicense: false,
            note: null,
            adminNote: null,
            avatarUrl: null, 
            activatedAccount: false, 
        });


        return res.status(201).json({ success: 'User created' });
},
}
