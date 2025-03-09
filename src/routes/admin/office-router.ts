import express from 'express';
import officeMiddleware from '../../middlewares/admin/office-middleware';
import { jwtAccessVerify } from '../../middlewares/tokenVerify-middleware';
import officeController from '../../controllers/admin/office-controller';
import substituteRouter from './substitute-router';
import officeSubController from '../../controllers/admin/office-sub-controller';

const router = express.Router();

//router.put('/update', jwtAccessVerify, officeMiddleware.isOffice);
router.post('/registerUser', jwtAccessVerify, officeMiddleware.isOffice, officeController.adminRegister);
router.post('/updateUserRole', jwtAccessVerify, officeMiddleware.isOffice, officeController.updateUserRole)
router.post('/updateUserLevel', jwtAccessVerify, officeMiddleware.isOffice, officeController.updateUserLevel)
router.post('/updateUserSenior', jwtAccessVerify, officeMiddleware.isOffice, officeController.updateUserSenior)
router.put('/updateUserCentre', jwtAccessVerify, officeMiddleware.isOffice, officeController.updateUserCentre)

router.get('/locationsWithVenues', jwtAccessVerify, officeMiddleware.isOffice, officeController.getLocationsWithVenues)
router.post('/addLocation', jwtAccessVerify, officeMiddleware.isOffice, officeController.addLocation)
router.post('/addVenue', jwtAccessVerify, officeMiddleware.isOffice, officeController.addVenue)
router.delete('/deleteLocation/:id', jwtAccessVerify, officeMiddleware.isOffice, officeController.deleteLocation)
router.delete('/deleteVenue/:id', jwtAccessVerify, officeMiddleware.isOffice, officeController.deleteVenue)
router.put('/updateLocation', jwtAccessVerify, officeMiddleware.isOffice, officeController.updateLocation)
router.put('/updateVenue', jwtAccessVerify, officeMiddleware.isOffice, officeController.updateVenue)

router.use('/admin', substituteRouter)


export default router;