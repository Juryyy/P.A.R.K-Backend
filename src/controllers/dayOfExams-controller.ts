import {Request, Response} from 'express';
import dayOfExamsService from '../services/dayOfExams-service';
import responseService from "../services/response-service";
import logger from "../configs/logger";
import { URequest } from "../types/URequest";
import { informAvailability } from "../middlewares/azure-email-middleware";
import userService from '../services/user-service';

export default {
    createDayOfExams: async (req: URequest, res: Response) => {
        const { date, isForInvigilators, isForExaminers } = req.body;
        if (!date || date === '') {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }
    
        if (!isForInvigilators && !isForExaminers) {
            return res.status(400).json({ error: 'Please select at least one option' });
        }
    
        const dateObj = new Date(date);
        try {
            const x = await dayOfExamsService.createDayOfExams(dateObj, isForInvigilators, isForExaminers);
            await responseService.createResponsesForDay(x.id, isForInvigilators, isForExaminers);
        } catch (error) {
            logger.error(`Day of exams already exists: ${dateObj}`);
            return res.status(400).json({ error: 'Day of exams already exists' });
        }
    
        return res.status(201).json({ success: 'Day of exams created' });
    },

    getDayOfExams: async (req: Request, res: Response) => {
        const dayOfExams = await dayOfExamsService.getDayOfExams();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        const filteredDayOfExams = dayOfExams.filter((day) => {
            const examDate = new Date(day.date);
            examDate.setHours(0, 0, 0, 0);
            return examDate >= today;
        });
    
        filteredDayOfExams.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
    
        return res.status(200).json(filteredDayOfExams);
    },
    

    deleteDayOfExams: async (req: Request, res: Response) => {
        const {id} = req.params;
        const parsedId = parseInt(id);

        if(!parsedId) {
            return res.status(400).json({ error: 'Invalid id' });
        }

        const dayOfExams = await dayOfExamsService.getDayOfExamsById(parsedId);
        if(!dayOfExams) {
            return res.status(400).json({ error: 'Day of exams does not exists' });
        }
        try{
            await responseService.deleteResponsesForDay(parsedId);
            await dayOfExamsService.deleteDayOfExams(parsedId);
        }catch(error){
            logger.error(`Day of exams does not exists: ${parsedId}`);
            return res.status(400).json({ error: 'Day of exams does not exists' });
        }
        return res.status(200).json({ success: 'Day of exams deleted' });
    },

    changeLock: async (req: Request, res: Response) => {
        const {id} = req.params;
        const parsedId = parseInt(id);

        if(!parsedId) {
            return res.status(400).json({ error: 'Invalid id' });
        }
        
        try{
            await dayOfExamsService.changeLock(parsedId);
        }catch(error){
            logger.error(`Day of exams does not exists: ${parsedId}`);
            return res.status(400).json({ error: 'Day of exams does not exists' });
        }
        return res.status(200).json({ success: 'Lock changed' });
    },

    informUsers: async (req: Request, res: Response) => {
        const {startDate, endDate, dateOfSubmits} = req.body;

        if (!startDate || startDate === '' || !endDate || endDate === '' || !dateOfSubmits || dateOfSubmits === '') {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }

        const users = await userService.getAllUsers();

        const startMonth = new Date(startDate).getMonth();
        const endMonth = new Date(endDate).getMonth();

        const startDateSplit = startDate.split('-');
        const startDateFormatted = `${startDateSplit[2]}/${startDateSplit[1]}/${startDateSplit[0]}`;

        const endDateSplit = endDate.split('-');
        const endDateFormatted = `${endDateSplit[2]}/${endDateSplit[1]}/${endDateSplit[0]}`;

        const dateOfSubmitsSplit = dateOfSubmits.split('-');
        const dateOfSubmitsFormatted = `${dateOfSubmitsSplit[2]}/${dateOfSubmitsSplit[1]}/${dateOfSubmitsSplit[0]}`;

        const availability = `Availability ${startMonth + 1}/${endMonth + 1}`;

        for (const user of users) {
            const {email, firstName, lastName} = user;
            await informAvailability(email, availability, startDateFormatted, endDateFormatted, dateOfSubmitsFormatted, firstName, lastName);
        
        return res.status(200).json({ success: 'Users informed' });
        }
    },
}