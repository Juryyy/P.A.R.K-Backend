import {User, RoleEnum, Prisma, PrismaClient, ResponseEnum, DayOfExams, Exam, TypeOfExamEnum} from '@prisma/client';
import {Request, Response} from 'express';
import userService from '../services/user-service';
import dayOfExamsService from '../services/dayOfExams-service';
import responseService from '../services/response-service';
import { URequest } from '../types/URequest';
import examService from '../services/exam-service';
import examSchema from '../helpers/Schemas/exam-schemas';
import logger from '../configs/logger';

export default{
    createExam: async (req: URequest, res: Response) => {
        const {venue, type, levels, startTime, endTime, note, dayOfExamsId} = req.body;

        try{
            examSchema.parse({venue, type, levels, startTime, endTime, note, dayOfExamsId});

       } catch (error : unknown) {
              logger.error(error);
           return res.status(401).json({ error: 'Invalid data' });
       }


        const dayOfExamsExists = await dayOfExamsService.getDayOfExamsById(dayOfExamsId);
        if(!dayOfExamsExists) {
            return res.status(400).json({ error: 'Day of exams does not exists' });
        }

        const examDate = new Date(dayOfExamsExists.date).toISOString().split('T')[0];

        // Combine the exam date with the provided times
        const start = new Date(examDate + 'T' + startTime + 'Z');
        const finish = new Date(examDate + 'T' + endTime + 'Z');

        const newExam = await examService.createExam(
            venue,
            type,
            levels,
            start,
            finish,
            note,
            dayOfExamsId,
        );

        logger.info(`New exam created: ${newExam.venue} by ${req.user?.firstName} ${req.user?.lastName}`);

        return res.status(201).json({ message: 'Exam created' });
    },

    getAllExams : async (req: URequest, res: Response) => {
        const exams = await examService.getAllExams();
        return res.status(200).json({exams});
    }

}


