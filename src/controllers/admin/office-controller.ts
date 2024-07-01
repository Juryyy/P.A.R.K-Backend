import { Request, Response } from 'express';
import userService from '../../services/user-service';
import authService from '../../services/auth-service';
import responseService from '../../services/response-service';
import { RoleEnum, User, ResponseEnum } from '@prisma/client';
import dayOfExamsService from '../../services/dayOfExams-service';
import logger from '../../configs/logger';
import { URequest } from '../../types/URequest';
import crypto from 'crypto';
import {sendEmail} from '../../middlewares/email-middleware';
import RegisterSchema from '../../helpers/Schemas/office-schemas';
import locationsService from '../../services/locations-service';

export default {
    adminRegister: async (req: URequest, res: Response) => {
        const {firstName, lastName, email, Srole} = req.body;

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
            dateOfBirth: new Date(),
            password: hash,
            role: Srole as RoleEnum,
            activatedAccount: false,
            deactivated: false,
        });

        const dayOfExams = await dayOfExamsService.getDayOfExams();
        const currentDate = new Date();
        for (let dayOfExam of dayOfExams) {
            if (dayOfExam.date > currentDate) {
                try{
                await responseService.createResponse(dayOfExam.id, newUser.id, ResponseEnum.No);
            }catch(error){
                logger.error(error);
                return res.status(400).json({ error: 'Invalid data' });
            }
            }
        }
        await sendEmail(email, 'P.A.R.K Exams center login details', password, newUser.firstName, newUser.lastName);
        console.log(password)
        logger.info(`New user registered: ${newUser.email} by ${req.user?.firstName} ${req.user?.lastName}`);
        return res.status(201).json({ success: 'New user registered' });
    },

    updateUserRole : async (req: URequest, res: Response) => {
        const { id, role } = req.body;
        if (!id || !role || id === '' || role === '') {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }

        if (!(role in RoleEnum)) {
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


    //* Locations and Venues

    getLocationsWithVenues: async (req: URequest, res: Response) => {
        try{
            const locationsWithVenues = await locationsService.getLocationsWithVenues();
            return res.status(200).json(locationsWithVenues);
        }
        catch(error){
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }
    },

    addLocation: async (req: URequest, res: Response) => {
        const { location } = req.body;
        if (!location || location === '') {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }
        try {
            const newLocation = await locationsService.addLocation(location);
            logger.info(`New location created: ${newLocation.name} by ${req.user?.firstName} ${req.user?.lastName}`);
            return res.status(201).json({ success: `Location ${newLocation.name} created` });
        } catch (error) {
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }
    },

    addVenue: async (req: URequest, res: Response) => {
        const { venue, location, link} = req.body;
        let existLocation;
        if (!venue || venue === '' || !location || location === '' || !link || link === ''){
            return res.status(400).json({ error: 'Please fill all the fields' });
        }

        try{
            const nLocation = parseInt(location);
            existLocation = await locationsService.getLocationById(nLocation)
        }catch(error){
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }

        try {
            const data = {
                name: venue,
                location: {
                    connect: { id: existLocation?.id }
                },
                gLink : link
            }
            const newVenue = await locationsService.addVenue(data);
            logger.info(`New venue created: ${newVenue.name} by ${req.user?.firstName} ${req.user?.lastName}`);
            return res.status(201).json({ success: `Venue ${newVenue.name} created` });
        } catch (error) {
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }
    },

    deleteLocation: async (req: URequest, res: Response) => {
        const { id } = req.params;
        if (!id || id === '') {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }
        try {
            const location = await locationsService.deleteLocation(parseInt(id));
            logger.info(`Location ${location.name} deleted by ${req.user?.firstName} ${req.user?.lastName}`);
            return res.status(200).json({ success: `Location ${location.name} deleted` });
        } catch (error) {
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }
    },

    deleteVenue: async (req: URequest, res: Response) => {
        const { id } = req.params;
        if (!id || id === '') {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }
        try {

            const venue = await locationsService.deleteVenue(parseInt(id));
            logger.info(`Venue ${venue.name} deleted by ${req.user?.firstName} ${req.user?.lastName}`);
            return res.status(200).json({ success: `Venue ${venue.name} deleted` });
        } catch (error) {
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }
    }
}