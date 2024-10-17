import logger from '../configs/logger';
import { dailyLock } from './dailyLock';

export const scheduleAllTasks = async () => {
    logger.info('Starting all tasks');
    dailyLock.start();
}