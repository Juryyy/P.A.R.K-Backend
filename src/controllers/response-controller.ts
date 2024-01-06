import {ResponseEnum} from '@prisma/client'
import {Request, Response} from 'express'
import responseService from '../services/response-service'
import dayOfExamsService from '../services/dayOfExams-service'
import userService from '../services/user-service'
import responseSchema from '../helpers/response-helper'

export default {
    //! This function needs to be rewritten to take userid from the token

    updateResponses: async (req: Request, res: Response) => {
        const responses = req.body;

        if(!responses || responses.length === 0) {
            return res.status(401).json({ error: 'Please fill all the fields' });
        }

        const valid = responseSchema.validateResponses(responses);

        if(!valid) {
            return res.status(402).json({ error: 'Invalid responses' });
        }

        for (let i = 0; i < responses.length; i++) {
            const {dayofExamsId, userId, response} = responses[i];

            const dayOfExamsExists = await dayOfExamsService.getDayOfExamsById(dayofExamsId);
            if(!dayOfExamsExists) {
                return res.status(402).json({ error: 'Day of exams does not exists' });
            }

            const userExists = await userService.getUserById(userId);
            if(!userExists) {
                return res.status(403).json({ error: 'User does not exists' });
            }

            if(!(response in ResponseEnum)) {
                return res.status(404).json({ error: 'Invalid response' });
            }

            await responseService.updateResponse(dayofExamsId, userId, response);
        }

        return res.status(200).json({ message: 'Responses updated' });
    }
}