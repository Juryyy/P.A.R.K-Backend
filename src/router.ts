import express from 'express';
import authRouter from './routes/auth-router';
import dayOfExamsRouter from './routes/dayOfExams-router';
import responseRouter from './routes/response-router';
import userRouter from './routes/user-router';
import officeRouter from './routes/admin/office-router';
import examRouter from './routes/exam-router';
import staticRouter from './routes/static-router';
import candidatesRouter from './routes/admin/candidates-router';
import postRouter from './routes/post-router';
import onedriveRouter from './routes/onedrive-router';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.use('/auth', authRouter)
router.use('/examDays', dayOfExamsRouter)
router.use('/responses', responseRouter)
router.use('/users', userRouter)
router.use('/office', officeRouter)
router.use('/candidates', candidatesRouter)
router.use('/posts', postRouter)
router.use('/exams', examRouter)
router.use('/posts', postRouter)
router.use('/onedrive', onedriveRouter)

router.use('/static', staticRouter)

export default router;