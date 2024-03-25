import express from 'express';
import officeMiddleware from '../../middlewares/admin/office-middleware';
import { jwtAccessVerify } from '../../middlewares/tokenVerify-middleware';

const router = express.Router();

router.post('/create', jwtAccessVerify, officeMiddleware.isOffice);

export default router;