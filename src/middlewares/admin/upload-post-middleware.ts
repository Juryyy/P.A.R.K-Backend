import { Post, User } from "@prisma/client";
import envConfig from "../../configs/env-config";
import client from "../../configs/onedrive-config";
import fileService from "../../services/file-service";
import logger from "../../configs/logger";


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