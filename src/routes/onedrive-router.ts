import express from 'express';
import { jwtAccessVerify } from '../middlewares/tokenVerify-middleware';
import onedriveController from '../controllers/onedrive-controller';
import check from '../middlewares/admin/office-middleware';

const router = express.Router();

//This function is only for development purposes
router.get('/onedrive/siteId', jwtAccessVerify, check.isOffice, onedriveController.getSiteId);
  
router.post('/files/download', jwtAccessVerify, onedriveController.downloadFile);
//router.delete('/onedrive/files/delete', jwtAccessVerify, check.isOffice, onedriveController.deleteFile);
  
export default router;