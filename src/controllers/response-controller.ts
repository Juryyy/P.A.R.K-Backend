import { AdminCentreEnum, LevelEnum, ResponseEnum, User } from '@prisma/client';
import { Response } from 'express';
import responseService from '../services/response-service';
import dayOfExamsService from '../services/dayOfExams-service';
import userService from '../services/user-service';
import ResponseSchema from '../helpers/Schemas/response-schemas';
import { URequest } from '../types/URequest';
import logger from '../configs/logger';

export default {
    updateResponses: async (req: URequest, res: Response) => {
        const responses = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Please login' });
        }

        if (!responses || responses.length === 0) {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }

        try {
            ResponseSchema.parse(responses);
        } catch (error: unknown) {
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }

        for (let i = 0; i < responses.length; i++) {
            const { id, response } = responses[i];

            const responseExists = await responseService.getResponseById(id);
            if (!responseExists) {
                return res.status(400).json({ error: 'Response does not exists' });
            }

            const dayofExamsId = responseExists.dayOfExamsId;

            const dayOfExamsExists = await dayOfExamsService.getDayOfExamsById(dayofExamsId);
            if (!dayOfExamsExists) {
                return res.status(400).json({ error: 'Day of exams does not exists' });
            }

            const userExists = await userService.getUserById(userId);
            if (!userExists) {
                return res.status(401).json({ error: 'User does not exists' });
            }

            if (!(response in ResponseEnum)) {
                return res.status(400).json({ error: 'Invalid response option' });
            }
            try {
                if (!dayOfExamsExists.isLocked)
                await responseService.updateResponse(dayofExamsId, userId, response);
            } catch (error) {
                logger.error(error);
                return res.status(400).json({ error: 'Invalid data' });
            }
        }

        return res.status(200).json({ message: 'Responses updated' });
    },

    getResponses: async (req: URequest, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Please login' });
        }

        const userExists = await userService.getUserById(userId);
        if (!userExists) {
            return res.status(401).json({ error: 'User does not exists' });
        }

        const responses = await responseService.getResponsesForUser(userId);

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        let responsesForUser: { id: number, response: ResponseEnum, date: Date, isLocked: boolean, centre: AdminCentreEnum }[] = [];
        for (let response of responses) {
            const dayOfExams = await dayOfExamsService.getDayOfExamsById(response.dayOfExamsId);
            if (!dayOfExams) {
                return res.status(404).json({ error: 'Day of exams does not exists' });
            }
            if (dayOfExams.date >= currentDate) {
                responsesForUser.push({ id: response.id, response: response.response, date: dayOfExams.date, isLocked: dayOfExams.isLocked, centre: dayOfExams.adminCentre });
            }
        }

        responsesForUser.sort((a, b) => {
            return a.date.getTime() - b.date.getTime();
        });

        return res.status(200).json(responsesForUser);
    },

    getResponsesExamDay: async (req: URequest, res: Response) => {
        let dayOfExamsExists;
        const id = parseInt(req.params.id);

        try {
            dayOfExamsExists = await dayOfExamsService.getDayOfExamsById(id);
        } catch (error) {
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }

        if (!dayOfExamsExists) {
            return res.status(400).json({ error: 'Day of exams does not exists' });
        }

        try {
            const responses = await responseService.getResponsesForDay(id);
            if (!responses) {
                return res.status(400).json({ error: 'Responses do not exists' });
            }
            const responsesWithUser: { dayOfExamsId: number, id: number, response: ResponseEnum, userName: string, userRole: string[], assigned: boolean, userId: number, userNote?: string | null, userLevel: LevelEnum[] }[] = [];
            for (let response of responses) {
                const user = await userService.getUserById(response.userId);
                if (!user) {
                    return res.status(400).json({ error: 'User does not exists' });
                }
                responsesWithUser.push({
                    dayOfExamsId: response.dayOfExamsId,
                    id: response.id,
                    response: response.response,
                    userName: user.firstName + ' ' + user.lastName,
                    userRole: user.role,
                    assigned: response.assigned,
                    userId: user.id,
                    userNote: user.note ?? undefined,
                    userLevel: user.level
                });
            }
            return res.status(200).json(responsesWithUser);
        } catch (error) {
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }
    }
};
