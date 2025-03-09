import express from 'express';
import officeMiddleware from '../../middlewares/admin/office-middleware';
import { jwtAccessVerify } from '../../middlewares/tokenVerify-middleware';
import officeController from '../../controllers/admin/office-controller';
import substituteRouter from './substitute-router';
import officeSubController from '../../controllers/admin/office-sub-controller';

const router = express.Router();

router.put('/sub/status', jwtAccessVerify, officeMiddleware.isOffice, officeSubController.updateSubstitutionStatus)
router.put('/app/status', jwtAccessVerify, officeMiddleware.isOffice, officeSubController.updateApplicationStatus)

export default router;