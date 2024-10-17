import dateLockService from '../services/dateLock-service';
import cron from 'node-cron';
import dayOfExamsService from '../services/dayOfExams-service';
import logger from '../configs/logger';

export const dailyLock = cron.schedule('48 18 * * *', async () => {
    try {
        const date = new Date();
        date.setUTCHours(0, 0, 0, 0);  // Still set to midnight of the current day
        
        const dateLock = await dateLockService.getDateLock(date);
        if (!dateLock) {
            logger.info(`No date lock found for ${date}. No exams to lock.`);
            return;
        }

        const dayOfExams = await dayOfExamsService.getDayOfExamsInRange(dateLock.first, dateLock.last);
        for (const dayOfExam of dayOfExams) {
            await dayOfExamsService.lockDayOfExams(dayOfExam.id);
        }
        await dateLockService.deleteDateLock(date);
        logger.info(`All exams locked for ${date}`);
    } catch (error) {
        logger.error(`Error in daily lock job: ${error}`);
    }
});

