import {User, RoleEnum, Prisma, PrismaClient, ResponseEnum, DayOfExams, Exam, TypeOfExamEnum} from '@prisma/client';
import {Request, Response} from 'express';
import userService from '../services/user-service';
import dayOfExamsService from '../services/dayOfExams-service';
import responseService from '../services/response-service';
import { URequest } from '../types/URequest';
import examService from '../services/exam-service';
import examSchema from '../helpers/Schemas/exam-schemas';
import logger from '../configs/logger';
import { createDayReportPdf } from '../middlewares/pdf-middleware';
import path from 'path';

export default{
    createExam: async (req: URequest, res: Response) => {
        const {venue, type, levels, startTime, endTime, note, dayOfExamsId} = req.body;

        try{
            examSchema.examInfoSchema.parse({venue, type, levels, startTime, endTime, note, dayOfExamsId});

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
        return res.status(200).json(exams);
    },

    addWorker: async(req: URequest, res: Response) => {
        const {examId, userId, role, override} = req.body;

        if (role !== RoleEnum.Supervisor && role !== RoleEnum.Invigilator && role !== RoleEnum.Examiner) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const examExists = await examService.getExamById(examId);
        if(!examExists) {
            return res.status(400).json({ error: 'Exam does not exists' });
        }

        const userExists = await userService.getUserById(userId);
        if(!userExists) {
            return res.status(400).json({ error: 'User does not exists' });
        }

        const examdayId = examExists.dayOfExamsId;

        const responseExists = await responseService.getResponseByExamIDAndUserId(examdayId, userId);
        if(!responseExists) {
            return res.status(400).json({ error: 'Response does not exists' });
        }

        if (responseExists.response === ResponseEnum.No && override === false) {
            return res.status(400).json({ error: 'User is not available' });
        }

        switch (role) {
            case RoleEnum.Supervisor:
                const supExam = await examService.addSupervisor(examId, userId);
                logger.info(`Supervisor added to exam: ${supExam.venue} by ${req.user?.firstName} ${req.user?.lastName}`);
                break;
            case RoleEnum.Invigilator:
                const invigExam = await examService.addInvigilator(examId, userId);
                logger.info(`Invigilator added to exam: ${invigExam.venue} by ${req.user?.firstName} ${req.user?.lastName}`);
                break;
            case RoleEnum.Examiner:
                const examinerExam = await examService.addExaminer(examId, userId);
                logger.info(`Examiner added to exam: ${examinerExam.venue} by ${req.user?.firstName} ${req.user?.lastName}`);
                break;
        }

        return res.status(200).json({ message: 'Worker added' });

    },

    removeWorker: async(req: URequest, res: Response) => {
        const {examId, userId, role} = req.body;

        const examExists = await examService.getExamById(examId);
        if(!examExists) {
            return res.status(400).json({ error: 'Exam does not exists' });
        }

        const userExists = await userService.getUserById(userId);
        if(!userExists) {
            return res.status(400).json({ error: 'User does not exists' });
        }

        if (role !== RoleEnum.Supervisor && role !== RoleEnum.Invigilator && role !== RoleEnum.Examiner) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        switch (role) {
            case RoleEnum.Supervisor:
                const supExam = await examService.removeSupervisor(examId, userId);
                logger.info(`Supervisor removed from exam: ${supExam.venue} by ${req.user?.firstName} ${req.user?.lastName}`);
                break;
            case RoleEnum.Invigilator:
                const invigExam = await examService.removeInvigilator(examId, userId);
                logger.info(`Invigilator removed from exam: ${invigExam.venue} by ${req.user?.firstName} ${req.user?.lastName}`);
                break;
            case RoleEnum.Examiner:
                const examinerExam = await examService.removeExaminer(examId, userId);
                logger.info(`Examiner removed from exam: ${examinerExam.venue} by ${req.user?.firstName} ${req.user?.lastName}`);
                break;
        }

        return res.status(200).json({ message: 'Worker removed' });

    },

    createDayReport: async(req: URequest, res: Response) => {
        const {examId, comment, issues} = req.body;

        try{
            examSchema.examDayReportSchema.parse({examId, comment, issues});
       } catch (error : unknown) {
              logger.error(error);
           return res.status(400).json({ error: 'Invalid data' });
       }

        const e = await examService.getExamById(examId);

        if(!e) {
            return res.status(400).json({ error: 'Exam does not exists' });
        }

        const dateObj = new Date(e?.startTime);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = String(dateObj.getFullYear()).substr(-2); 
        const date = `${day}.${month}.${year}`

        const supervisors = await examService.getSupervisorsByExamId(examId);
        const invigilators = await examService.getInvigilatorsByExamId(examId);
        const examiners = await examService.getExaminersByExamId(examId);

        if(!supervisors || !invigilators || !examiners) {
            return res.status(400).json({ error: 'Exam has no workers' });
        }

        const supervisorNames = supervisors.supervisors.map(supervisor => supervisor.firstName + ' ' + supervisor.lastName);
        const invigilatorNames = invigilators.invigilators.map(invigilator => invigilator.firstName + ' ' + invigilator.lastName);
        const examinerNames = examiners.examiners.map(examiner => examiner.firstName + ' ' + examiner.lastName);


        try {
            createDayReportPdf(date, e.venue, e.type, e.levels, supervisorNames, invigilatorNames, examinerNames, comment, issues);
        } catch (error) {
            logger.error(error);
            return res.status(400).json({ error: 'Error creating PDF' });
        }

        await examService.addPdfUrl(examId, `${date} - ${e.venue} - ${e.type}.pdf`);

        return res.status(200).json({ message: 'Report created' });
    },

    getDayReport : async (req: URequest, res: Response) => {
        const examId = parseInt(req.params.id);

        const e = await examService.getExamById(examId);

        if(!e) {
            return res.status(400).json({ error: 'Exam does not exists' });
        }

        if(!e.pdfUrl) {
            return res.status(400).json({ error: 'Exam has no report' });
        }

        const filePath = path.resolve(__dirname, '../../static/pdf', e.pdfUrl);

        res.sendFile(filePath);
    },

    getUpcomingExamsWithAllData : async (req: URequest, res: Response) => {
        const exams = await examService.getUpcomingExamsWithEverything();
        return res.status(200).json(exams);
    },

    getUsersExams : async (req: URequest, res: Response) => {
        const userId = req.user?.id;
        if(!userId) {
            return res.status(401).json({ error: 'Please login' });
        }

        const userExists = await userService.getUserById(userId);
        if(!userExists) {
            return res.status(401).json({ error: 'User does not exists' });
        }

        const exams = await examService.getExamsForUser(userId);
        return res.status(200).json(exams);
    },

}

