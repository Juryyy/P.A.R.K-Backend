import express from 'express';
import { jwtAccessVerify } from '../middlewares/tokenVerify-middleware';
import { processAndSaveAvatar } from '../configs/user-config';
import userController from '../controllers/user-controller';
import examController from '../controllers/exam-controller';
import check from '../middlewares/admin/office-middleware';


const router = express.Router();

router.get('/usersExams', jwtAccessVerify, examController.getUsersExams);
router.get('/allUsers', jwtAccessVerify, userController.getAllUsers);
router.get('/profile/:id', jwtAccessVerify, userController.getProfile);
router.get('/userInfo', jwtAccessVerify, userController.getUserInfo);
router.put('/updateAdminNote', jwtAccessVerify, check.isOffice, userController.updateAdminNote);
router.post('/upload', jwtAccessVerify, processAndSaveAvatar, userController.updateAvatar);
router.put('/updateInspera', jwtAccessVerify, check.isOffice, userController.updateInsperaAccount);

router.put('/update', jwtAccessVerify, userController.updateUser);

export default router;