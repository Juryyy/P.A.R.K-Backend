import express from 'express';
import officeMiddleware from '../middlewares/admin/office-middleware';
import { jwtAccessVerify } from '../middlewares/tokenVerify-middleware';
import examController from '../controllers/exam-controller';
import upload from '../configs/upload-config';


const router = express.Router();

router.post('/createExam', jwtAccessVerify, examController.createExam);
router.get('/allExams', jwtAccessVerify, examController.getAllExams);
router.get('/upcomingExams', jwtAccessVerify, examController.getUpcomingExamsWithAllData);
router.get('/:id', jwtAccessVerify, examController.getExam);
router.post('/addWorker', jwtAccessVerify, examController.addWorker);
router.post('/removeWorker', jwtAccessVerify, examController.removeWorker);
router.post('/createDayReport', jwtAccessVerify, examController.createDayReport);
router.get('/dayReport/:id', jwtAccessVerify, examController.getDayReport);

router.put('/updateExam', jwtAccessVerify, examController.updateExam);

router.post('/uploadExamSchedule', jwtAccessVerify, upload.array('files', 10), examController.uploadExamSchedule);





export default router;