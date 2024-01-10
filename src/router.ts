import express from 'express';
import authRouter from './routes/auth-router';
import dayOfExamsRouter from './routes/dayOfExams-router';
import responseRouter from './routes/response-router';
import userRouter from './routes/user-router';
import officeRouter from './routes/admin/office-router';
import examRouter from './routes/admin/exam-router';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.use('/auth', authRouter)
router.use('/dayofexams', dayOfExamsRouter)
router.use('/responses', responseRouter)
router.use('/users', userRouter)
router.use('/office', officeRouter)
router.use('/exam', examRouter)

export default router;