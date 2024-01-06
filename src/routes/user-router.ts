import express from 'express';
import { jwtAccessVerify } from '../middlewares/tokenVerify-middleware';
import { uploadAvatar } from '../configs/user-config';
import userController from '../controllers/user-controller';

const router = express.Router();

router.post('/upload', jwtAccessVerify, uploadAvatar, userController.updateAvatar);

export default router;