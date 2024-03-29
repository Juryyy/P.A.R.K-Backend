import express from 'express';
import responseController from '../controllers/response-controller';
import { jwtAccessVerify } from '../middlewares/tokenVerify-middleware';


const router = express.Router();

router.put('/update', jwtAccessVerify, responseController.updateResponses);
router.get('/responses', jwtAccessVerify, responseController.getResponses);
router.get('/responsesExamDay/:id', jwtAccessVerify, responseController.getResponsesExamDay);

export default router;