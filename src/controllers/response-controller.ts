import {ResponseEnum, User} from '@prisma/client'
import {Request, Response} from 'express'
import responseService from '../services/response-service'
import dayOfExamsService from '../services/dayOfExams-service'
import userService from '../services/user-service'
import responseSchema from '../helpers/response-helper'
import { URequest } from '../configs/URequest';

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

        const valid = responseSchema.validateResponses(responses);

        if(!valid) {
            return res.status(400).json({ error: 'Scheme is not valid' });
        }

        for (let i = 0; i < responses.length; i++) {
            const {dayofExamsId, response} = responses[i];

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
    }
}