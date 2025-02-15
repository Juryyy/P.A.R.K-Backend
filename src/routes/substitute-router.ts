import express from 'express';
import check from '../middlewares/admin/office-middleware';
import { jwtAccessVerify } from '../middlewares/tokenVerify-middleware';
import substituteController from '../controllers/substitute-controller';

const router = express.Router();

router.post('/create', jwtAccessVerify, substituteController.createSubstitution);
router.get('', jwtAccessVerify, substituteController.getSubstitutions);
router.post('/apply/:substitutionId', jwtAccessVerify, substituteController.applyForSubstitution);
router.get('/exam/:examId', jwtAccessVerify, substituteController.getSubsForExam);
router.get('/applications/by_user', jwtAccessVerify, substituteController.getMyApplications);
router.delete('/cancel/:substitutionId', jwtAccessVerify, substituteController.deleteSubstitution);
router.delete('/withdraw/:id', jwtAccessVerify, substituteController.withdrawApplication);
router.get('/count', jwtAccessVerify, substituteController.getCountOfOpenSubstitutions);

export default router;