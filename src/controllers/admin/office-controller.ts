import { Request, Response } from 'express';
import userService from '../../services/user-service';
import authService from '../../services/auth-service';
import responseService from '../../services/response-service';
import { RoleEnum, User, ResponseEnum } from '@prisma/client';
import dayOfExamsService from '../../services/dayOfExams-service';
import logger from '../../configs/logger';
import { URequest } from '../../types/URequest';
import crypto from 'crypto';
import sendEmail from '../../middlewares/email-middleware';
import RegisterSchema from '../../helpers/Schemas/office-schemas';
import locationsService from '../../services/locations-service';


export default {
    adminRegister: async (req: URequest, res: Response) => {
        const {firstName, lastName, email, Srole} = req.body;
        console.log(req.body)
        //console.log('firstName', firstName, 'lastName', lastName, 'email', email, 'role', role);

        try {
            RegisterSchema.parse({ email, firstName, lastName, Srole });
        } catch (error : unknown) {
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }
        
        const userExists = await userService.getUserByEmail(email);
        if(userExists) {
            return res.status(402).json({ error: 'Email taken' });
        }

        const password = crypto.randomBytes(8).toString('hex');

        const hash = authService.hashPassword(password);

        const newUser = await userService.createUser({
            firstName,
            lastName,
            email,
            phone: null,
            password: hash,
            role: Srole as RoleEnum,
            activatedAccount: false,
            deactivated: false,
        });

        const dayOfExams = await dayOfExamsService.getDayOfExams();
        const currentDate = new Date();
        for (let dayOfExam of dayOfExams) {
            if (dayOfExam.date > currentDate) {
                await responseService.createResponse(dayOfExam.id, newUser.id, ResponseEnum.No);
            }
        }
        await sendEmail(email, 'P.A.R.K Exams center login details', password, newUser.firstName, newUser.lastName);

        logger.info(`New user registered: ${newUser.email} by ${req.user?.firstName} ${req.user?.lastName}`);
        return res.status(201).json({ success: 'New user registered' });
    },

    updateUserRole : async (req: URequest, res: Response) => {
        const { id, role } = req.body;
        if (!id || !role || id === '' || role === '') {
            console.log('id', id, 'role', role);
            return res.status(400).json({ error: 'Please fill all the fields' });
        }

        if (!(role in RoleEnum)) {
            console.log('role', role);
            return res.status(400).json({ error: 'Invalid role' });
        }

        try{
            const user = await userService.updateUserRole(id, role as RoleEnum);
            logger.info(`User ${user.email} role updated by ${req.user?.firstName} ${req.user?.lastName}`);
            return res.status(200).json({ success: 'User role updated' });
        }catch(error){
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }
    },

    getLocationsWithVenues: async (req: URequest, res: Response) => {
        const locationsWithVenues = await locationsService.getLocationsWithVenues();
        return res.status(200).json(locationsWithVenues);
    },

    addLocation: async (req: URequest, res: Response) => {
        const { location } = req.body;
        if (!location || location === '') {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }
        try {
            const newLocation = await locationsService.addLocation(location);
            logger.info(`New location created: ${newLocation.name} by ${req.user?.firstName} ${req.user?.lastName}`);
            return res.status(201).json({ success: 'New location created' });
        } catch (error) {
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }
    },

    addVenue: async (req: URequest, res: Response) => {
        const { venue, location} = req.body;
        if (!venue || venue === '' || !location){
            return res.status(400).json({ error: 'Please fill all the fields' });
        }

        const locationId = parseInt(location);

        try {
            const newVenue = await locationsService.addVenue(venue, locationId);
            logger.info(`New venue created: ${newVenue.name} by ${req.user?.firstName} ${req.user?.lastName}`);
            return res.status(201).json({ success: 'New venue created' });
        } catch (error) {
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }
    }
}