import express from 'express';
import { jwtAccessVerify } from '../middlewares/tokenVerify-middleware';
import { uploadAvatar } from '../configs/user-config';
import userController from '../controllers/user-controller';
import examController from '../controllers/exam-controller';

const router = express.Router();

router.post('/upload', jwtAccessVerify, uploadAvatar, userController.updateAvatar);
router.get('/usersExams', jwtAccessVerify, examController.getUsersExams);

export default router;