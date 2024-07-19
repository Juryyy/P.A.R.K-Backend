import express from 'express';
import officeMiddleware from '../../middlewares/admin/office-middleware';
import { jwtAccessVerify } from '../../middlewares/tokenVerify-middleware';
import officeController from '../../controllers/admin/office-controller';


const router = express.Router();

router.put('/update', jwtAccessVerify, officeMiddleware.isOffice);
router.post('/registerUser', /*jwtAccessVerify,*/officeController.adminRegister);
router.post('/updateUserRole', jwtAccessVerify, officeMiddleware.isOffice, officeController.updateUserRole)
router.get('/locationsWithVenues', jwtAccessVerify, officeMiddleware.isOffice, officeController.getLocationsWithVenues)

router.post('/addLocation', jwtAccessVerify, officeMiddleware.isOffice, officeController.addLocation)
router.post('/addVenue', jwtAccessVerify, officeMiddleware.isOffice, officeController.addVenue)
router.delete('/deleteLocation/:id', jwtAccessVerify, officeMiddleware.isOffice, officeController.deleteLocation)
router.delete('/deleteVenue/:id', jwtAccessVerify, officeMiddleware.isOffice, officeController.deleteVenue)

export default router;