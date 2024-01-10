import { Request, Response } from 'express';
import userService from '../../services/user-service';
import authService from '../../services/auth-service';
import responseService from '../../services/response-service';
import { RoleEnum, User, ResponseEnum } from '@prisma/client';
import dayOfExamsService from '../../services/dayOfExams-service';
import logger from '../../configs/logger';
import { URequest } from '../../types/URequest';
import crypto from 'crypto';
import sendEmail from '../../middlewares/email-middleware';
import RegisterSchema from '../../helpers/Schemas/office-schemas';


export default {
    adminRegister: async (req: URequest, res: Response) => {
        const {firstName, lastName, email, role} = req.body;
       
        try {
            RegisterSchema.parse({ email, firstName, lastName, role });
        } catch (error : unknown) {
            logger.error(error);
            return res.status(401).json({ error: 'Invalid data' });
        }
        
        const userExists = await userService.getUserByEmail(email);
        if(userExists) {
            return res.status(402).json({ error: 'Email taken' });
        }

        const password = crypto.randomBytes(8).toString('hex');

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
        await sendEmail(email, 'P.A.R.K Exams center login details', password, newUser.firstName, newUser.lastName);

        logger.info(`New user registered: ${newUser.email} by ${req.user?.firstName} ${req.user?.lastName}`);
        return res.status(201).json({ success: 'New user registered' });
    },
}