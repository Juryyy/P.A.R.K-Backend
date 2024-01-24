import express from 'express';
import dayOfExamsController from '../controllers/dayOfExams-controller';

const router = express.Router();

router.post('/create', dayOfExamsController.createDayOfExams);
router.get('/examDays', dayOfExamsController.getDayOfExams);

export default router;