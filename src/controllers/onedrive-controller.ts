import {Request, Response} from 'express';
import dayOfExamsService from '../services/dayOfExams-service';
import logger from "../configs/logger";
import { URequest } from "../types/URequest";
import envConfig from "../configs/env-config";
import client from "../configs/onedrive-config";
import fileService from "../services/file-service";
import { formatDateToDMY } from "../helpers/format-date";
import dayReportService from '../services/dayReport-service';
import examService from '../services/exam-service';
import { ResponseType } from '@microsoft/microsoft-graph-client';
import mime from 'mime-types';
import path from 'path';

interface FileInformation {
  name: string;
  route: string;
}

export default {
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
  
  downloadPostFile: async (req: Request, res : Response) => {
    const siteId = envConfig.getEnv('SITE_ID');
    const id = req.params.id;

    try {
        const file = await fileService.getFileById(parseInt(id));
        if (!file) return res.status(404).send({ message: 'File not found' });

        const fileExtension = path.extname(file.name);
        const mimeType = mime.lookup(fileExtension);

        let response;
        if (mimeType && mimeType.startsWith('application/')) {
            response = await client
                .api(`/sites/${siteId}/drive/root:/Import/Posts/${file.name}:/content`)
                .responseType(ResponseType.ARRAYBUFFER)
                .get();
        } else {
            response = await client
                .api(`/sites/${siteId}/drive/root:/Import/Posts/${file.name}:/content`)
                .get();
        }

        res.setHeader('Content-Disposition', `attachment; filename=${file.name}`);
        res.setHeader('Content-Type', mimeType || 'application/octet-stream');

        if (mimeType && mimeType.startsWith('application/')) {
            return res.send(Buffer.from(response));
        } else {
            return res.send(response);
        }
    } catch (err) {
        logger.error(err);
        return res.status(500).send({ message: 'Error downloading file' });
    }
  },

  deletePostFile: async (req: URequest, res: Response) => {
    const siteId = envConfig.getEnv('SITE_ID');
    const id = req.params.fileId;

    try{
      const file = await fileService.getFileById(parseInt(id));
      if(!file) return res.status(404).send({ message: 'File not found' });

      await client
        .api(`/sites/${siteId}/drive/root:/Import/Posts/${file.name}`)
        .delete();

      await fileService.deleteFile(parseInt(id));
      return res.send({ message: 'File deleted' });
    }catch(err){
      logger.error(err);
      return res.status(500).send({ message: 'Error deleting file' });
    }
  },

  printAllFolders: async (req: Request, res: Response) => {
    const siteId = envConfig.getEnv('SITE_ID');
    const folderPath = `/sites/${siteId}/drive/root:/Import/Exams:/children`;

    const fetchFolders = async (folderPath: string): Promise<FileInformation[]> => {
      let folders: FileInformation[] = [];
      try {
        const response = await client.api(folderPath).get();
        for (const item of response.value) {
          if (item.folder) {
            folders.push({ name: item.name, route: item.webUrl });
          }
        }
      } catch (err) {
        logger.error(err);
        throw new Error('Error fetching folders');
      }
      return folders;
    };

    try {
      const foldersInfo: FileInformation[] = await fetchFolders(folderPath);
      res.send(foldersInfo);
    } catch (err: any) {
      logger.error(err);
      res.status(500).send({ message: err.message });
    }
  },

  downloadExamFile: async (req: Request, res: Response) => {
    const siteId = envConfig.getEnv('SITE_ID');
    const id = req.params.id;

    try {
        const file = await fileService.getFileByIdWithExam(parseInt(id));
        if (!file) return res.status(404).send({ message: 'File not found' });

        const dayOfExams = await dayOfExamsService.getDayOfExamsById(file.exam[0].dayOfExamsId);
        if (!dayOfExams) return res.status(404).send({ message: 'Day of exams not found' });

        const formattedDate = formatDateToDMY(new Date(dayOfExams.date));

        const fileExtension = path.extname(file.name);
        const mimeType = mime.lookup(fileExtension);

        let response;
        if (mimeType && mimeType.startsWith('application/')) {
            response = await client
                .api(`/sites/${siteId}/drive/root:/Import/Exams/${formattedDate}/${file.name}:/content`)
                .responseType(ResponseType.ARRAYBUFFER)
                .get();
        } else {
            response = await client
                .api(`/sites/${siteId}/drive/root:/Import/Exams/${formattedDate}/${file.name}:/content`)
                .get();
        }

        res.setHeader('Content-Disposition', `attachment; filename=${file.name}`);
        res.setHeader('Content-Type', mimeType || 'application/octet-stream');

        if (mimeType && mimeType.startsWith('application/')) {
            return res.send(Buffer.from(response));
        } else {
            return res.send(response);
        }
    } catch (err) {
        logger.error(err);
        return res.status(500).send({ message: 'Error downloading file' });
    }
  },

  printFilesInGivenFolder: async (req: Request, res: Response) => {
    const siteId = envConfig.getEnv('SITE_ID');
    const folderPath = `/sites/${siteId}/drive/root:/Import/Exams/Reports/15-08-2024:/children`;

    const fetchFiles = async (folderPath: string): Promise<FileInformation[]> => {
      let files: FileInformation[] = [];
      try {
        const response = await client.api(folderPath).get();
        for (const item of response.value) {
          if (item.file) {
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
      const filesInfo: FileInformation[] = await fetchFiles(folderPath);
      res.send(filesInfo);
    } catch (err: any) {
      logger.error(err);
      res.status(500).send({ message: err.message });
    }
  },

  downloadReportFile: async (req: Request, res: Response) => {
    const siteId = envConfig.getEnv('SITE_ID');
    const id = req.params.id;

    try {
        const file = await dayReportService.getDayReportById(parseInt(id));
        if (!file) return res.status(404).send({ message: 'File not found' });

        const exam = await examService.getExamById(file.examId);
        if (!exam) return res.status(404).send({ message: 'Exam not found' });

        const dayOfExams = await dayOfExamsService.getDayOfExamsById(exam.dayOfExamsId);
        if (!dayOfExams) return res.status(404).send({ message: 'Day of exams not found' });

        const formattedDate = formatDateToDMY(new Date(dayOfExams.date));

        const response = await client
            .api(`/sites/${siteId}/drive/root:/Import/Exams/Reports/${formattedDate}/${file.name}:/content`)
            .responseType(ResponseType.ARRAYBUFFER)
            .get();

        res.setHeader('Content-Disposition', `attachment; filename=${file.name}`);
        res.setHeader('Content-Type', 'application/pdf');
        return res.send(Buffer.from(response));
    } catch (err) {
        logger.error(err);
        return res.status(500).send({ message: 'Error downloading file' });
    }
  },



}