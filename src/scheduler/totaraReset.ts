import cron from 'node-cron';
import logger from '../configs/logger';
import userService from '../services/user-service';

// Cron schedule to check every first day of month


export const totaraReset = cron.schedule('37 14 * * *', async () => {
    try {
        logger.info(`Totara reset job started`);
        const users = await userService.getAllUsers();
        for (const user of users) {
            await userService.resetUserTotara(user);
        }
        logger.info(`Totara reset job finished`);
    } catch (error) {
        logger.error(`Error in totara reset job: ${error}`);
    }    
});
