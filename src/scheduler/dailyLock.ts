import dateLockService from '../services/dateLock-service';
import cron from 'node-cron';
import dayOfExamsService from '../services/dayOfExams-service';
import logger from '../configs/logger';
import { AdminCentreEnum } from '@prisma/client';

export const dailyLock = cron.schedule('48 18 * * *', async () => {
    try {
        const date = new Date();
        date.setUTCHours(0, 0, 0, 0);  // Still set to midnight of the current day

        // Iterate through all AdminCentreEnum values
        for (const centre of Object.values(AdminCentreEnum)) {
            try {
                const dateLock = await dateLockService.getDateLock(date, centre);
                if (!dateLock) {
                    logger.info(`No date lock found for ${date} at centre ${centre}. No exams to lock.`);
                    continue;
                }

                const dayOfExams = await dayOfExamsService.getDayOfExamsInRange(
                    dateLock.first, 
                    dateLock.last, 
                    centre
                );

                for (const dayOfExam of dayOfExams) {
                    await dayOfExamsService.lockDayOfExams(dayOfExam.id);
                }

                await dateLockService.deleteDateLock(date, centre);
                logger.info(`All exams locked for ${date} at centre ${centre}`);
            } catch (error) {
                // Log errors for individual centres but continue processing others
                logger.error(`Error processing centre ${centre} in daily lock job: ${error}`);
            }
        }
    } catch (error) {
        // Log errors that occur outside the centre processing loop
        logger.error(`Critical error in daily lock job: ${error}`);
    }
});
