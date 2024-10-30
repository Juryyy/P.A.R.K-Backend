import logger from '../configs/logger';
import { dailyLock } from './dailyLock';
import { totaraReset } from './totaraReset';

export const scheduleAllTasks = async () => {
    logger.info('Starting all tasks');
    dailyLock.start();
    totaraReset.start();
}