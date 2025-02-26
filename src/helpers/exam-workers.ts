import { RoleEnum, ResponseEnum } from '@prisma/client';
import logger from '../configs/logger';
import examService from '../services/exam-service';
import responseService from '../services/response-service';
import userService from '../services/user-service';
import { URequest } from '../types/URequest';

/**
 * Adds a worker to an exam with a specific role
 * @param examId The ID of the exam
 * @param userId The ID of the user to be added
 * @param position The role of the worker (Supervisor, Invigilator, or Examiner)
 * @param override Whether to override availability check
 * @param currentUser Optional information about the user performing the action
 * @returns An object containing success status and message
 */
export async function addWorker(
    examId: number, 
    userId: number, 
    position: RoleEnum, 
    override: boolean,
    currentUser?: URequest
) {
    if (position !== RoleEnum.Supervisor && position !== RoleEnum.Invigilator && position !== RoleEnum.Examiner) {
        throw new Error('Invalid position');
    }

    const examExists = await examService.getExamById(examId);
    if (!examExists) {
        throw new Error('Exam does not exist');
    }

    const userExists = await userService.getUserById(userId);
    if (!userExists) {
        throw new Error('User does not exist');
    }

    const examdayId = examExists.dayOfExamsId;

    const responseExists = await responseService.getResponseByExamIDAndUserId(examdayId, userId);
    if (!responseExists) {
        throw new Error('Response does not exist');
    }

    if (responseExists.response === ResponseEnum.No && override === false) {
        throw new Error('User is not available');
    }

    try {
        let updatedExam;
        
        switch (position) {
            case RoleEnum.Supervisor:
                updatedExam = await examService.addSupervisor(examId, userId);
                await responseService.assign(examdayId, userId);
                logger.info(`Supervisor added to exam: ${updatedExam.venue} by ${currentUser?.user?.firstName || 'Unknown'} ${currentUser?.user?.lastName || 'User'}`);
                break;
                
            case RoleEnum.Invigilator:
                updatedExam = await examService.addInvigilator(examId, userId);
                await responseService.assign(examdayId, userId);
                logger.info(`Invigilator added to exam: ${updatedExam.venue} by ${currentUser?.user?.firstName || 'Unknown'} ${currentUser?.user?.lastName || 'User'}`);
                break;
                
            case RoleEnum.Examiner:
                updatedExam = await examService.addExaminer(examId, userId);
                await responseService.assign(examdayId, userId);
                logger.info(`Examiner added to exam: ${updatedExam.venue} by ${currentUser?.user?.firstName || 'Unknown'} ${currentUser?.user?.lastName || 'User'}`);
                break;
        }
        
        return { success: true, message: 'Worker added' };
    } catch (error) {
        logger.error(error);
        throw new Error('Invalid data');
    }
}

/**
 * Removes a worker from an exam
 * @param examId The ID of the exam
 * @param userId The ID of the user to be removed
 * @param position The role of the worker (Supervisor, Invigilator, or Examiner)
 * @param currentUser Optional information about the user performing the action
 * @returns An object containing success status and message
 */
export async function removeWorker(
    examId: number, 
    userId: number, 
    position: RoleEnum,
    currentUser: URequest
) {
    const examExists = await examService.getExamById(examId);
    if (!examExists) {
        throw new Error('Exam does not exist');
    }

    const userExists = await userService.getUserById(userId);
    if (!userExists) {
        throw new Error('User does not exist');
    }
    
    if (position !== RoleEnum.Supervisor && position !== RoleEnum.Invigilator && position !== RoleEnum.Examiner) {
        throw new Error('Invalid position');
    }

    try {
        let updatedExam;
        
        switch (position) {
            case RoleEnum.Supervisor:
                updatedExam = await examService.removeSupervisor(examId, userId);
                await responseService.unAssign(examExists.dayOfExamsId, userId);
                logger.info(`Supervisor removed from exam: ${updatedExam.venue} by ${currentUser?.user?.firstName || 'Unknown'} ${currentUser?.user?.lastName || 'User'}`);
                break;
                
            case RoleEnum.Invigilator:
                updatedExam = await examService.removeInvigilator(examId, userId);
                await responseService.unAssign(examExists.dayOfExamsId, userId);
                logger.info(`Invigilator removed from exam: ${updatedExam.venue} by ${currentUser?.user?.firstName || 'Unknown'} ${currentUser?.user?.lastName || 'User'}`);
                break;
                
            case RoleEnum.Examiner:
                updatedExam = await examService.removeExaminer(examId, userId);
                await responseService.unAssign(examExists.dayOfExamsId, userId);
                logger.info(`Examiner removed from exam: ${updatedExam.venue} by ${currentUser?.user?.firstName || 'Unknown'} ${currentUser?.user?.lastName || 'User'}`);
                break;
        }
        
        return { success: true, message: 'Worker removed' };
    } catch (error) {
        logger.error(error);
        throw new Error('Invalid data');
    }
}