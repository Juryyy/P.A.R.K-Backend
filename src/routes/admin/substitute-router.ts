import express from 'express';
import officeMiddleware from '../../middlewares/admin/office-middleware';
import { jwtAccessVerify } from '../../middlewares/tokenVerify-middleware';
import officeController from '../../controllers/admin/office-controller';

const router = express.Router();

export default router;