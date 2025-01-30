import {User, RoleEnum, ResponseEnum, AdminCentreEnum } from '@prisma/client';
import { Response} from 'express';
import userService from '../services/user-service';
import dayOfExamsService from '../services/dayOfExams-service';
import responseService from '../services/response-service';
import { URequest } from '../types/URequest';
import examService from '../services/exam-service';
import examSchema from '../helpers/Schemas/exam-schemas';
import logger from '../configs/logger';
import { createDayReportPdf } from '../middlewares/pdf-middleware';
import path from 'path';
import locationsService from '../services/locations-service';
import { ExamWithVenueLink } from '../types/extraTypes';
import { uploadDayReportToOnedrive, uploadExamFileToOD } from '../middlewares/admin/upload-middleware';
import { informExam } from '../middlewares/azure-email-middleware';
import confirmationService from '../services/confirmation-service';

export default{
    createExam: async (req: URequest, res: Response) => {
        const {venue, location, type, levels, startTime, endTime, note, dayOfExamsId, adminCentre} = req.body;

        try{
            examSchema.examInfoSchema.parse({venue, location, type, levels, startTime, endTime, note, dayOfExamsId, adminCentre});

       } catch (error : unknown) {
              logger.error(error);
           return res.status(400).json({ error: 'Invalid data' });
       }


        const dayOfExamsExists = await dayOfExamsService.getDayOfExamsById(dayOfExamsId);
        if(!dayOfExamsExists) {
            return res.status(400).json({ error: 'Day of exams does not exists' });
        }

        const examDate = new Date(dayOfExamsExists.date).toISOString().split('T')[0];

        // Combine the exam date with the provided times, timezone in czechia is UTC+2
        const start = new Date(examDate + 'T' + startTime + ':00.000Z');
        const finish = new Date(examDate + 'T' + endTime + ':00.000Z');

        const newExam = await examService.createExam(
            venue,
            location,
            type,
            levels,
            start,
            finish,
            note,
            dayOfExamsId,
            adminCentre as AdminCentreEnum
        );

        logger.info(`New exam created: ${newExam.venue} by ${req.user?.firstName} ${req.user?.lastName}`);

        return res.status(201).json({ message: 'Exam created' });
    },

    getAllExams : async (req: URequest, res: Response) => {
        const exams = await examService.getAllExams();
        return res.status(200).json(exams);
    },

    addWorker: async(req: URequest, res: Response) => {
        const {examId, userId, override, position} = req.body;

        if (position !== RoleEnum.Supervisor && position !== RoleEnum.Invigilator && position !== RoleEnum.Examiner) {
            return res.status(400).json({ error: 'Invalid position' });
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

        switch (position) {
            case RoleEnum.Supervisor:
                try{
                    const supExam = await examService.addSupervisor(examId, userId);
                    await responseService.assign(examdayId, userId);
                    logger.info(`Supervisor added to exam: ${supExam.venue} by ${req.user?.firstName} ${req.user?.lastName}`);
                }catch(error){
                    logger.error(error);
                    return res.status(400).json({ error: 'Invalid data' });
                }

                break;
            case RoleEnum.Invigilator:
                try{
                const invigExam = await examService.addInvigilator(examId, userId);
                await responseService.assign(examdayId, userId);
                logger.info(`Invigilator added to exam: ${invigExam.venue} by ${req.user?.firstName} ${req.user?.lastName}`);
                }catch(error){
                    logger.error(error);
                    return res.status(400).json({ error: 'Invalid data' });
                }
                break;
            case RoleEnum.Examiner:
                try{
                    const examinerExam = await examService.addExaminer(examId, userId);
                    await responseService.assign(examdayId, userId);
                    logger.info(`Examiner added to exam: ${examinerExam.venue} by ${req.user?.firstName} ${req.user?.lastName}`);
                }catch(error){
                    logger.error(error);
                    return res.status(400).json({ error: 'Invalid data' });
                }
                break;
        }

        return res.status(200).json({ message: 'Worker added' });

    },

    removeWorker: async(req: URequest, res: Response) => {
        const {examId, userId, position} = req.body;
        
        const examExists = await examService.getExamById(examId);
        if(!examExists) {
            return res.status(400).json({ error: 'Exam does not exists' });
        }

        const userExists = await userService.getUserById(userId);
        if(!userExists) {
            return res.status(400).json({ error: 'User does not exists' });
        }
        
        if (position !== RoleEnum.Supervisor && position !== RoleEnum.Invigilator && position !== RoleEnum.Examiner) {
            return res.status(400).json({ error: 'Invalid position' });
        }

        switch (position) {
            case RoleEnum.Supervisor:
                try{
                    const supExam = await examService.removeSupervisor(examId, userId);
                    await responseService.unAssign(examExists.dayOfExamsId, userId);
                    logger.info(`Supervisor removed from exam: ${supExam.venue} by ${req.user?.firstName} ${req.user?.lastName}`);
                }catch(error){
                    logger.error(error);
                    return res.status(400).json({ error: 'Invalid data' });
                }
                break;
            case RoleEnum.Invigilator:
                try{
                    const invigExam = await examService.removeInvigilator(examId, userId);
                    await responseService.unAssign(examExists.dayOfExamsId, userId);
                    logger.info(`Invigilator removed from exam: ${invigExam.venue} by ${req.user?.firstName} ${req.user?.lastName}`);
                }catch(error){
                    logger.error(error);
                    return res.status(400).json({ error: 'Invalid data' });
                }
                break;
            case RoleEnum.Examiner:
                try{
                    const examinerExam = await examService.removeExaminer(examId, userId);
                    await responseService.unAssign(examExists.dayOfExamsId, userId);
                    logger.info(`Examiner removed from exam: ${examinerExam.venue} by ${req.user?.firstName} ${req.user?.lastName}`);
                }catch(error){
                    logger.error(error);
                    return res.status(400).json({ error: 'Invalid data' });
                }
                break;
        }
        return res.status(200).json({ message: 'Worker removed' });

    },

    createDayReport: async(req: URequest, res: Response) => {
        const { examId, candidates, absent, comment, issues, absentCandidates } = req.body;

        const examIdN = parseInt(examId);
        const candidatesN = parseInt(candidates);
        const absentN = parseInt(absent);
    
        try {
            examSchema.examDayReportSchema.parse({ examIdN, candidatesN, absentN, comment, issues, absentCandidates });
        } catch (error: unknown) {
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }
    
        const exam = await examService.getExamById(examIdN);
    
        if (!exam) {
            return res.status(400).json({ error: 'Exam does not exist' });
        }
    
        const dateObj = new Date(exam.startTime);
        const date = dateObj.toISOString().split('T')[0].split('-').reverse().join('-');
    
        const supervisors = await examService.getSupervisorsByExamId(examIdN);
        const invigilators = await examService.getInvigilatorsByExamId(examIdN);
        const examiners = await examService.getExaminersByExamId(examIdN);
    
        if (!supervisors || !invigilators || !examiners) {
            return res.status(400).json({ error: 'Exam has no workers' });
        }
    
        const supervisorNames = supervisors.supervisors.map(supervisor => supervisor.firstName + ' ' + supervisor.lastName);
        const invigilatorNames = invigilators.invigilators.map(invigilator => invigilator.firstName + ' ' + invigilator.lastName);
        const examinerNames = examiners.examiners.map(examiner => examiner.firstName + ' ' + examiner.lastName);
        
        const address = exam.venue+'-'+exam.location
        const filename = `${address}.pdf`;
        
        try {
            const filePath = await createDayReportPdf(date, address, exam.type, exam.levels, candidatesN, absentN, supervisorNames, invigilatorNames, examinerNames, comment, issues, filename, absentCandidates);
    
            await uploadDayReportToOnedrive(filePath, exam, req.user as User, filename);
    
            return res.status(200).json({ message: 'Report created' });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Error creating PDF' });
        }
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
        try{
            const exams = await examService.getUpcomingExamsWithEverything();
            return res.status(200).json(exams);
        }catch(error){
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }
    },

    getUsersExams : async (req: URequest, res: Response) => {
        const userId = req.user?.id;
        if(!userId) {
            return res.status(401).json({ error: 'Please login' });
        }

        try{
            const exams = await examService.getExamsForUser(userId);
            const filteredExams : ExamWithVenueLink[] = exams.filter((exam) => {
                const date = new Date(exam.startTime);
                return date > new Date();
            });
            for (const exam of filteredExams) {
                const location = await locationsService.getLocation({name: exam.location});
                const venue = await locationsService.getVenue(exam.venue, location!.id);
                exam.venueLink = venue?.gLink;
            }
            return res.status(200).json(filteredExams);
        }catch(error){
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }
    },

    getExam : async (req: URequest, res: Response) => {
        const id = parseInt(req.params.id);
        try{
            const exam = await examService.getExamById(id);
            return res.status(200).json(exam);
        }catch(error){
            logger.error(error);
            return res.status(400).json({ error: 'Exam does not exists' });
        }
    },

    uploadExamFile : async (req: URequest, res: Response) => {
        const files = req.files as Express.Multer.File[];
        const examId = parseInt(req.body.examId);

        const exam = await examService.getExamById(examId);

        if (!exam) {
            return res.status(400).json({ error: 'Exam not found' });
        }

        try {
            for (const file of files) {
                await uploadExamFileToOD(file, exam, req.user as User);
            }
        } catch (error) {
            logger.error(error);
            return res.status(400).json({ error: 'Error uploading file' });
        }

        return res.status(200).json({ message: 'File uploaded' });
    },

    updateExam : async (req: URequest, res: Response) => {
        const {exam} = req.body;

        try{
            examSchema.examInfoSchema.parse(exam);
        } catch (error : unknown) {
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }

        const e = await examService.getExamById(exam.id);

        if(!e) {
            return res.status(400).json({ error: 'Exam does not exists' });
        }

        const dayOfExamsExists = await dayOfExamsService.getDayOfExamsById(e.dayOfExamsId);
        if(!dayOfExamsExists) {
            return res.status(400).json({ error: 'Day of exams does not exists' });
        }

        const examDate = new Date(dayOfExamsExists.date).toISOString().split('T')[0];

        // Combine the exam date with the provided times, timezone in czechia is UTC+2

        const start = new Date(examDate + 'T' + exam.startTime + ':00.000Z');

        const finish = new Date(examDate + 'T' + exam.endTime + ':00.000Z');
        
        if (exam.schedule) {
            await examService.updateExam(exam.id, exam.venue, exam.location, exam.type, exam.levels, start, finish, exam.note, exam.schedule);
        } else {
            await examService.removeSchedule(exam.id);
            await examService.updateExam(exam.id, exam.venue, exam.location, exam.type, exam.levels, start, finish, exam.note);
        }

        return res.status(200).json({ message: 'Exam updated' });
    },

    deleteExam : async (req: URequest, res: Response) => {
        const id = parseInt(req.params.id);

        const exam = await examService.getExamById(id);

        if(!exam) {
            return res.status(400).json({ error: 'Exam does not exists' });
        }

        //Remove workers, remove files, remove exam
        try{
            for (const supervisor of exam.supervisors) {
                await examService.removeSupervisor(exam.id, supervisor.id);
            }
            for (const invigilator of exam.invigilators) {
                await examService.removeInvigilator(exam.id, invigilator.id);
            }
            for (const examiner of exam.examiners) {
                await examService.removeExaminer(exam.id, examiner.id);
            }

            await confirmationService.deleteConfirmationsByExamId(id);

            await examService.deleteExam(id);

        }catch(error){
            logger.error(error);
            return res.status(400).json({ error: 'Invalid id' });
        }

        return res.status(200).json({ message: 'Exam deleted' });
    },

    updateCompleted : async (req: URequest, res: Response) => {
        const {examId, completed} = req.body;

        const exam = await examService.getExamById(examId);

        if(!exam) {
            return res.status(400).json({ error: 'Exam does not exists' });
        }

        await examService.updateCompleted(examId, completed);

        return res.status(200).json({ message: 'Exam completed updated' });
    },

    updatePrepared : async (req: URequest, res: Response) => {
        const {examId, prepared} = req.body;

        const exam = await examService.getExamById(examId);

        if(!exam) {
            return res.status(400).json({ error: 'Exam does not exists' });
        }
    
        await examService.updatePrepared(examId, prepared);

        if(prepared === true) {

            const time = new Date(exam.startTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            const date = new Date(exam.startTime).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
            const loc = await locationsService.getLocation({name: exam.location});
            const venue = await locationsService.getVenue(exam.venue, loc!.id);
            const location = loc!.name + ' - ' + venue!.name;

            const supervisors = await examService.getSupervisorsByExamId(examId);
            const invigilators = await examService.getInvigilatorsByExamId(examId);
            const examiners = await examService.getExaminersByExamId(examId);

            if (!supervisors || !invigilators || !examiners) {
                return res.status(400).json({ error: 'Exam has no workers' });
            }

            for (const supervisor of supervisors.supervisors) {
                await confirmationService.createConfirmation(examId, supervisor.id, RoleEnum.Supervisor, false);
                await informExam(supervisor.email, `Exam - ${location} - ${date}`, location, date, time, supervisor.firstName, supervisor.lastName, RoleEnum.Supervisor.toString());
            }

            for (const invigilator of invigilators.invigilators) {
                await confirmationService.createConfirmation(examId, invigilator.id, RoleEnum.Invigilator, false);
                informExam(invigilator.email, `Exam - ${location} - ${date}`, location, date, time, invigilator.firstName, invigilator.lastName, RoleEnum.Invigilator.toString());
            }

            for (const examiner of examiners.examiners) {
                await confirmationService.createConfirmation(examId, examiner.id, RoleEnum.Examiner, false);
                informExam(examiner.email, `Exam - ${location} - ${date}`, location, date, time, examiner.firstName, examiner.lastName, RoleEnum.Examiner.toString());
            }
        }

        return res.status(200).json({ message: 'Exam prepared updated' });
    },

    getExamsByDay : async (req: URequest, res: Response) => {
        const dayId = parseInt(req.params.id);

        const exams = await examService.getExamsByDay(dayId);

        return res.status(200).json(exams);
    },

    confirmation: async (req: URequest, res: Response) => {
        const { examId, role, isConfirmed } = req.body;
        const userId = req.user?.id;
    
        if (!userId) {
          return res.status(401).json({ error: 'Please login' });
        }
    
        if (![RoleEnum.Supervisor, RoleEnum.Invigilator, RoleEnum.Examiner].includes(role)) {
          return res.status(400).json({ error: 'Invalid role' });
        }
    
        try {
          const updatedConfirmation = await confirmationService.updateConfirmation(examId, userId, role, isConfirmed);
          return res.status(200).json({ message: 'Confirmation updated', confirmation: updatedConfirmation });
        } catch (error) {
          logger.error('Failed to update confirmation:', error);
          return res.status(500).json({ error: 'Failed to update confirmation' });
        }
      }
    


}

