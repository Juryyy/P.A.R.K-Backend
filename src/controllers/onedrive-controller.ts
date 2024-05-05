import { DayOfExams} from "@prisma/client";
import {Request, Response} from 'express';
import dayOfExamsService from '../services/dayOfExams-service';
import responseService from "../services/response-service";
import logger from "../configs/logger";
import { URequest } from "../types/URequest";
import envConfig from "../configs/env-config";
import client from "../configs/onedrive";


export default {
    downloadFile: async (req: URequest, res: Response) => {
        const siteId = envConfig.getEnv('SITE_ID');;
        const filePath = req.body.filePath; 

        if(!filePath) return res.status(400).send({ message: 'File path is required' });

        try {
          const file = await client
            .api(`/sites/${siteId}/drive/root:/Import/${filePath}`)
            .get();
      
          const fileContent = await client
            .api(`/sites/${siteId}/drive/items/${file.id}/content`)
            .get();
      
          res.setHeader('Content-Disposition', 'attachment; filename=' + file.name);
          res.setHeader('Content-Type', file.file.mimeType);
          res.send(fileContent);
          
        } catch (err) {
          logger.error(err);
          return res.status(500).send({ message: 'Error downloading file' });
        }
      },

    getSiteId: async (req: Request, res: Response) => {
        const isDev = envConfig.getEnv('NODE_ENV');
        if (isDev !== 'development') {
            return res.status(403).send('This endpoint is only available in development mode');
        }
        const siteUrl = envConfig.getEnv('SITE_URL');
        try {
            const site = await client
                .api(`/sites/${siteUrl}`)
                .get();
            return res.send(site.id);
        } catch (err) {
            logger.error(err);
            return res.status(500).send({ message: 'Error getting site ID' });
        }
    },

    deleteFile: async (req: Request, res: Response) => {
    const siteId = envConfig.getEnv('SITE_ID'); 
    const filePath = req.body.filePath; 
    try {
      const file = await client
        .api(`/sites/${siteId}/drive/root:/${filePath}`)
        .get();
  
      await client
        .api(`/sites/${siteId}/drive/items/${file.id}`)
        .delete();

      res.send({ message: 'File deleted successfully' });
    } catch (err) {
      logger.error(err);
      return res.status(500).send({ message: 'Error deleting file' });
    }
  }
}