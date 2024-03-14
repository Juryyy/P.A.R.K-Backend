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

        const dateObj = new Date(date);
        try{
            const x = await dayOfExamsService.createDayOfExams(dateObj, isForInvigilators, isForExaminers);
            if (isForExaminers && !isForInvigilators){
                await responseService.createResponsesForDayExaminers(x.id);
            }
            else if (isForInvigilators && !isForExaminers){
                await responseService.createResponsesForDayInvigilators(x.id);
            }
            else{
                await responseService.createResponsesForDay(x.id);
            }
        }catch(error){
            logger.error(`Day of exams already exists: ${dateObj}`);
            return res.status(400).json({ error: 'Day of exams already exists' });
        }
    
        return res.status(201).json({ success: 'Day of exams created' });
    },

    getDayOfExams: async (req: Request, res: Response) => {
        const dayOfExams = await dayOfExamsService.getDayOfExams();
        //days that are today or in future
        const today = new Date();
        const filteredDayOfExams = dayOfExams.filter((day) => {
            return day.date >= today;
        });

        filteredDayOfExams.sort((a, b) => {
            return a.date.getTime() - b.date.getTime();
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
    }
}