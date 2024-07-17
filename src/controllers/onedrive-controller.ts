import { DayOfExams} from "@prisma/client";
import {Request, Response} from 'express';
import dayOfExamsService from '../services/dayOfExams-service';
import responseService from "../services/response-service";
import logger from "../configs/logger";
import { URequest } from "../types/URequest";
import envConfig from "../configs/env-config";
import client from "../configs/onedrive";


interface FileInformation {
  name: string;
  route: string;
}

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
  },
  
  getAllFiles: async (req: Request, res: Response) => {
    const siteId = envConfig.getEnv('SITE_ID');
  
    // Recursive function to fetch files from a folder and its subfolders
    const fetchFiles = async (folderPath: string): Promise<FileInformation[]> => {
      let files: FileInformation[] = [];
      try {
        const response = await client.api(folderPath).get();
        for (const item of response.value) {
          if (item.folder) {
            // If the item is a folder, recursively fetch its files
            const subfolderFiles: FileInformation[] = await fetchFiles(`${folderPath}/${item.name}:/children`);
            files = files.concat(subfolderFiles);
          } else {
            // If the item is a file, add it to the files array
            files.push({ name: item.name, route: item.webUrl });
          }
        }
      } catch (err) {
        logger.error(err);
        throw new Error('Error fetching files');
      }
      return files;
    };
  
    try {
      // Start the deep search from the 'Import' folder
      const filesInfo: FileInformation[] = await fetchFiles(`/sites/${siteId}/drive/root:/Import:/children`);
      res.send(filesInfo);
    } catch (err : any) {
      res.status(500).send({ message: err.message });
    }
  },

  uploadTest: async (req: Request, res: Response) => {
    const siteId = envConfig.getEnv('SITE_ID');
    // Define the content of the plain text file
    const fileContent = "This is the content of Test.txt";
    const fileName = "Test2.txt"; // Hardcoded file name
  
    try {
      const response = await client
        .api(`/sites/${siteId}/drive/root:/Import/${fileName}:/content`)
        .put(Buffer.from(fileContent));
  
      return res.send(response);
    } catch (err) {
      logger.error(err);
      return res.status(500).send({ message: 'Error uploading file' });
    }
  },

  downloadTest: async (req: Request, res: Response) => {
    const siteId = envConfig.getEnv('SITE_ID');
    const fileName = "Test.txt"; // Hardcoded file name
  
    try {
      // Get the file content
      const response = await client
        .api(`/sites/${siteId}/drive/root:/Import/${fileName}:/content`)
        .get();
  
      // Set the content type to 'text/plain' for the response
      res.setHeader('Content-Type', 'text/plain');
      return res.send(response);
    } catch (err) {
      logger.error(err);
      return res.status(500).send({ message: 'Error downloading file' });
    }
  },
}