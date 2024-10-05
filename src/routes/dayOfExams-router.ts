import express from 'express';
import dayOfExamsController from '../controllers/dayOfExams-controller';
import check from '../middlewares/admin/office-middleware';
import { jwtAccessVerify } from '../middlewares/tokenVerify-middleware';

const router = express.Router();

router.post('/create', jwtAccessVerify, check.isOffice, dayOfExamsController.createDayOfExams);
router.get('/examDays', jwtAccessVerify, check.isOffice, dayOfExamsController.getDayOfExams);
router.delete('/delete/:id', jwtAccessVerify, check.isOffice, dayOfExamsController.deleteDayOfExams);
router.put('/changeLock/:id', jwtAccessVerify, check.isOffice, dayOfExamsController.changeLock);
router.post('/informUsers', jwtAccessVerify, check.isOffice, dayOfExamsController.informUsers);
router.get('/all', jwtAccessVerify, check.isOffice, dayOfExamsController.getAllDayOfExams);
export default router;