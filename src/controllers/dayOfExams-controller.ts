import { DayOfExams} from "@prisma/client";
import {Request, Response} from 'express';
import dayOfExamsService from '../services/dayOfExams-service';
import responseService from "../services/response-service";

export default {
    createDayOfExams: async (req: Request, res: Response) => {
        const {date} = req.body;
        if(!date || date === '') {
            return res.status(401).json({ error: 'Please fill all the fields' });
        }
    
        const [day, month, year] = date.split(".");
        const dateObj = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
    
        const dayOfExamsExists = await dayOfExamsService.getDayOfExamsByDate(dateObj);
        if(dayOfExamsExists) {
            return res.status(402).json({ error: 'Day of exams already exists' });
        }
    
        const x = await dayOfExamsService.createDayOfExams(dateObj);
        await responseService.createResponsesForDay(x.id);

        console.log(x);
    
        return res.status(201).json({ success: 'Day of exams created' });
    },

}