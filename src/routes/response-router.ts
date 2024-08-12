import express from 'express';
import responseController from '../controllers/response-controller';
import { jwtAccessVerify } from '../middlewares/tokenVerify-middleware';
import check from '../middlewares/admin/office-middleware';


const router = express.Router();

router.put('/update', jwtAccessVerify, responseController.updateResponses);
router.get('/responses', jwtAccessVerify,  responseController.getResponses);
router.get('/responsesExamDay/:id', jwtAccessVerify, check.isOffice, responseController.getResponsesExamDay);

export default router;