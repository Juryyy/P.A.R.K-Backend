import {ResponseEnum, User} from '@prisma/client'
import {Request, Response} from 'express'
import responseService from '../services/response-service'
import dayOfExamsService from '../services/dayOfExams-service'
import userService from '../services/user-service'
import ResponseSchema from '../helpers/Schemas/response-schemas'
import { URequest } from '../types/URequest';

export default { 
    updateResponses: async (req: URequest, res: Response) => {
        const responses = req.body;
        const userId = req.user?.id;

        if(!userId) {
            return res.status(401).json({ error: 'Please login' });
        }

        if(!responses || responses.length === 0) {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }

        try{
            console.log(responses)
             ResponseSchema.parse(responses);
        } catch (error : unknown) {
            console.log(error)
            return res.status(400).json({ error: 'Invalid data' });
        }

        for (let i = 0; i < responses.length; i++) {
            const {id, response} = responses[i];

            const responseExists = await responseService.getResponseById(id);
            if(!responseExists) {
                return res.status(400).json({ error: 'Response does not exists' });
            }

            const dayofExamsId = responseExists.dayOfExamsId;

            const dayOfExamsExists = await dayOfExamsService.getDayOfExamsById(dayofExamsId);
            if(!dayOfExamsExists) {
                return res.status(400).json({ error: 'Day of exams does not exists' });
            }

            const userExists = await userService.getUserById(userId);
            if(!userExists) {
                return res.status(401).json({ error: 'User does not exists' });
            }

            if(!(response in ResponseEnum)) {
                return res.status(400).json({ error: 'Invalid response option' });
            }

            await responseService.updateResponse(dayofExamsId, userId, response);
        }

        return res.status(200).json({ message: 'Responses updated' });
    },

    getResponses: async (req: URequest, res: Response) => {
        //this function should return all the responses for the user that are not for the the past
        const userId = req.user?.id;
        if(!userId) {
            return res.status(401).json({ error: 'Please login' });
        }

        const userExists = await userService.getUserById(userId);
        if(!userExists) {
            return res.status(401).json({ error: 'User does not exists' });
        }

        const responses = await responseService.getResponsesForUser(userId);
        const currentDate = new Date();
        let responsesForUser: {id: number , response: ResponseEnum, date: Date}[] = [];
        for (let response of responses) {
            const dayOfExams = await dayOfExamsService.getDayOfExamsById(response.dayOfExamsId);
            if(!dayOfExams) {
                return res.status(400).json({ error: 'Day of exams does not exists' });
            }
            if (dayOfExams.date > currentDate) {
                responsesForUser.push({id: response.id, response: response.response, date: dayOfExams.date});
            }
        }
        
        responsesForUser.sort((a, b) => {
            return a.date.getTime() - b.date.getTime();
        });

        return res.status(200).json(responsesForUser);
    },

    getResponsesExamDay: async (req: URequest, res: Response) => {
        const id = parseInt(req.params.id);

        const dayOfExamsExists = await dayOfExamsService.getDayOfExamsById(id);
        if(!dayOfExamsExists) {
            return res.status(400).json({ error: 'Day of exams does not exists' });
        }

        const responses = await responseService.getUsersWithYesResponseForDayOfExams(id)

        if(!responses) {
            return res.status(400).json({ error: 'Responses do not exists' });
        }

        return res.status(200).json(responses);

    }

}