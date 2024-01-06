import express from 'express';
import responseController from '../controllers/response-controller';
import { jwtAccessVerify } from '../middlewares/tokenVerify-middleware';


const router = express.Router();

router.put('/update', jwtAccessVerify, responseController.updateResponses);

export default router;