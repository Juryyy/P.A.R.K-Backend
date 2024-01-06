import express from 'express';
import responseController from '../controllers/response-controller';


const router = express.Router();

router.put('/update', responseController.updateResponses);

export default router;