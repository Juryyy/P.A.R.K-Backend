import express from 'express';
import { jwtAccessVerify } from '../middlewares/tokenVerify-middleware';
import onedriveController from '../controllers/onedrive-controller';
import check from '../middlewares/admin/office-middleware';

const router = express.Router();

//This function is only for development purposes
router.get('/onedrive/siteId', jwtAccessVerify, check.isOffice, onedriveController.getSiteId);
  
router.get('/files/post/download/:id', jwtAccessVerify, onedriveController.downloadPostFile);
router.get('/files/exam/download/:id', jwtAccessVerify, onedriveController.downloadExamFile);

router.get('/files/exam/downloadReport/:id', jwtAccessVerify, onedriveController.downloadReportFile);
//router.delete('/onedrive/files/delete', jwtAccessVerify, check.isOffice, onedriveController.deleteFile);
//router.get('/files', onedriveController.printFilesInGivenFolder);

router.delete('/files/exam/delete/:fileId', jwtAccessVerify, check.isOffice, onedriveController.deleteExamFile);
router.delete('/files/post/delete/:fileId', jwtAccessVerify, check.isOffice, onedriveController.deletePostFile);
  
export default router;