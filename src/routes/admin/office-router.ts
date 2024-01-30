import express from 'express';
import officeMiddleware from '../../middlewares/admin/office-middleware';
import { jwtAccessVerify } from '../../middlewares/tokenVerify-middleware';
import officeController from '../../controllers/admin/office-controller';


const router = express.Router();

router.put('/update', jwtAccessVerify, officeMiddleware.isOffice);
router.post('/registerUser', jwtAccessVerify, officeController.adminRegister );
router.get('/allUsers', jwtAccessVerify, officeMiddleware.isOffice, officeController.getAllUsers);


export default router;