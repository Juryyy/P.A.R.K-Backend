import { Exam, Post, User } from "@prisma/client";
import envConfig from "../../configs/env-config";
import client from "../../configs/onedrive-config";
import fileService from "../../services/file-service";
import logger from "../../configs/logger";
import dayReportService from "../../services/dayReport-service";
import examService from "../../services/exam-service";
import dayOfExamsService from "../../services/dayOfExams-service";
import { formatDateToDMY } from "../../helpers/format-date";


export const uploadPostToOnedrive = async (file : Express.Multer.File, postId: number, user : User) => {
    const siteId = envConfig.getEnv('SITE_ID');
    
    try {
        await fileService.createFile({
          name: file.originalname,
          author: {
              connect: {
                  id: user.id
              }
          },
          post: {
              connect: {
                  id: postId
              }
          }
        });
  
        const response = await client
          .api(`/sites/${siteId}/drive/root:/Import/Posts/${file.originalname}:/content`)
          .put(file.buffer);

          logger.info(`File ${file.originalname} uploaded to OneDrive by ${user.firstName + ' ' + user.lastName}`);
          return response;
    } catch (err) {
        console.error(err);
        logger.error(err);
        throw new Error('Error uploading file');
    }
}

export const uploadExamScheduleToOnedrive = async (file: Express.Multer.File, exam: Exam, user: User) => {
    const siteId = envConfig.getEnv('SITE_ID');

    const dayOfExams = await dayOfExamsService.getDayOfExamsById(exam.dayOfExamsId);

    if (!dayOfExams) {
        throw new Error('Day of exams not found');
    }

    try {
        await fileService.createFile({
            name: file.originalname,
            author: {
                connect: {
                    id: user.id
                }
            },
            exam: {
                connect: {
                    id: exam.id
                }
            }
        });

        const formattedDate = formatDateToDMY(new Date(dayOfExams.date));

        const response = await client
            .api(`/sites/${siteId}/drive/root:/Import/Exams/${formattedDate}/${file.originalname}:/content`)
            .put(file.buffer);

        logger.info(`File ${file.originalname} uploaded to OneDrive by ${user.firstName + ' ' + user.lastName}`);
        return response;
        
    } catch (err) {
        console.error(err);
        logger.error(err);
        throw new Error('Error uploading file');
    }
}

