import { DayOfExams} from "@prisma/client";
import {Request, Response} from 'express';
import dayOfExamsService from '../services/dayOfExams-service';
import responseService from "../services/response-service";
import logger from "../configs/logger";
import { URequest } from "../types/URequest";

export default {
    createDayOfExams: async (req: URequest, res: Response) => {
        const {date, isForInvigilators, isForExaminers} = req.body;
        if(!date || date === '') {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }

        if(!isForInvigilators && !isForExaminers) {
            return res.status(400).json({ error: 'Please select at least one option' });
        }
    
        const [day, month, year] = date.split(".");
        const dateObj = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
    
        const dayOfExamsExists = await dayOfExamsService.getDayOfExamsByDate(dateObj);
        if(dayOfExamsExists) {
            logger.error(`Day of exams already exists: ${dateObj}`);
            return res.status(400).json({ error: 'Day of exams already exists' });
        }
    
        const x = await dayOfExamsService.createDayOfExams(dateObj, isForInvigilators, isForExaminers);
        await responseService.createResponsesForDay(x.id);

        console.log(x);
    
        return res.status(201).json({ success: 'Day of exams created' });
    },
}