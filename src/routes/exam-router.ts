import express from 'express';
import officeMiddleware from '../middlewares/admin/office-middleware';
import { jwtAccessVerify } from '../middlewares/tokenVerify-middleware';
import examController from '../controllers/exam-controller';
import upload from '../configs/upload-config';
import check from '../middlewares/admin/office-middleware';


const router = express.Router();

router.post('/createExam', jwtAccessVerify, check.isOffice, examController.createExam);
router.get('/allExams', jwtAccessVerify, check.isOffice, examController.getAllExams);
router.get('/upcomingExams', jwtAccessVerify, check.isOffice, examController.getUpcomingExamsWithAllData);
router.get('/:id', jwtAccessVerify, examController.getExam);
router.delete('/:id', jwtAccessVerify, examController.deleteExam);

router.post('/addWorker', jwtAccessVerify, check.isOffice, examController.addWorker);
router.post('/removeWorker', jwtAccessVerify, check.isOffice, examController.removeWorker);

router.post('/createDayReport', jwtAccessVerify, examController.createDayReport);
router.get('/dayReport/:id', jwtAccessVerify, examController.getDayReport);

router.put('/updateExam', jwtAccessVerify, check.isOffice, examController.updateExam);
router.post('/uploadExamSchedule', jwtAccessVerify, check.isOffice, upload.array('files', 10), examController.uploadExamFile);
router.put('/updateCompleted', jwtAccessVerify, check.isOffice, examController.updateCompleted);
router.put('/updatePrepared', jwtAccessVerify, check.isOffice, examController.updatePrepared);





export default router;