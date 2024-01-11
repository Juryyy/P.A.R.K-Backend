import express from 'express';
import officeMiddleware from '../../middlewares/admin/office-middleware';
import { jwtAccessVerify } from '../../middlewares/tokenVerify-middleware';
import examController from '../../controllers/exam-controller';


const router = express.Router();

router.post('/createExam', jwtAccessVerify, examController.createExam);
router.get('/getAllExams', jwtAccessVerify, examController.getAllExams);
router.post('/addWorker', jwtAccessVerify, examController.addWorker);
router.delete('/removeWorker', jwtAccessVerify, examController.removeWorker);
router.post('/createDayReport', jwtAccessVerify, examController.createDayReport);
router.get('/getDayReport/:id', jwtAccessVerify, examController.getDayReport);



export default router;