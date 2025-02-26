import { Response } from 'express';
import { ApplicationStatusEnum, SubstitutionStatusEnum } from '@prisma/client';
import logger from '../../configs/logger';
import { URequest } from '../../types/URequest';
import substituteService from '../../services/substitute-service';
import examController from '../exam-controller';

export default {
    updateSubstitutionStatus: async (req: URequest, res: Response) => {
        try {
            const { substitutionId, status } = req.body;
            if (!status || !(status in SubstitutionStatusEnum)){
                return res.status(400).json({ error: 'Invalid status' });
            }
            await substituteService.updateSubstitutionStatus(substitutionId, status);
            return res.status(200).json({ success: 'Substitution status changed' });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: error });
        }
    },

    updateApplicationStatus: async (req: URequest, res: Response) => {
        try {
            const { applicationId, status } = req.body;
            if (!status || !(status in ApplicationStatusEnum)){
                return res.status(400).json({ error: 'Invalid status' });
            }

            const application = await substituteService.updateApplicationStatus(applicationId, status);

            if(status === ApplicationStatusEnum.Accepted){
                await substituteService.updateSubstitutionStatus(application.substitutionId, SubstitutionStatusEnum.Assigned);
            }

            await substituteService.updateApplicationStatus(applicationId, status);
            return res.status(200).json({ success: 'Application status changed' });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: error });
        }
    }
}