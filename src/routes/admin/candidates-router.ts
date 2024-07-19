import express from 'express';
import officeMiddleware from '../../middlewares/admin/office-middleware';
import { jwtAccessVerify } from '../../middlewares/tokenVerify-middleware';
import candidatesController from '../../controllers/admin/candidates-controller';

const router = express.Router();

router.post('/create', jwtAccessVerify, officeMiddleware.isOffice, candidatesController.createCandidates);

export default router;