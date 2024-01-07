import { Request, Response } from 'express';
import userService from '../../services/user-service';
import authService from '../../services/auth-service';
import responseService from '../../services/response-service';
import { RoleEnum, User, ResponseEnum } from '@prisma/client';
import dayOfExamsService from '../../services/dayOfExams-service';
import logger from '../../configs/logger';
import { URequest } from '../../types/URequest';


export default {
    adminRegister: async (req: URequest, res: Response) => {
        const {firstName, lastName, email, role} = req.body;
        if(!email || !firstName || !lastName || !role ||
            firstName === '' || lastName === '' || email === '' || role === '') {
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
        //! Send password to email
        const password = "12345678";

        const hash = authService.hashPassword(password);

        const newUser = await userService.createUser({
            firstName,
            lastName,
            email,
            password: hash,
            role: role as RoleEnum,
            activatedAccount: false,
        });

        const dayOfExams = await dayOfExamsService.getDayOfExams();
        const currentDate = new Date();
        for (let dayOfExam of dayOfExams) {
            if (dayOfExam.date > currentDate) {
                await responseService.createResponse(dayOfExam.id, newUser.id, ResponseEnum.No);
            }
        }
        logger.info(`New user registered: ${newUser.email} by ${req.user?.firstName} ${req.user?.lastName}`);
        return res.status(201).json({ success: 'New user registered' });
    },
}