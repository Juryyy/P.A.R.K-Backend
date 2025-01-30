import { Response } from 'express';
import userService from '../../services/user-service';
import authService from '../../services/auth-service';
import responseService from '../../services/response-service';
import { RoleEnum, ResponseEnum, LevelEnum, AdminCentreEnum } from '@prisma/client';
import dayOfExamsService from '../../services/dayOfExams-service';
import logger from '../../configs/logger';
import { URequest } from '../../types/URequest';
import crypto from 'crypto';
import {sendEmail} from '../../middlewares/azure-email-middleware';
import RegisterSchema from '../../helpers/Schemas/office-schemas';
import locationsService from '../../services/locations-service';
import { update } from 'lodash';

export default {
    adminRegister: async (req: URequest, res: Response) => {
        const {firstName, lastName, email, role, centre} = req.body;
        try {
            RegisterSchema.parse({ email, firstName, lastName, role});
        } catch (error : any) {
            logger.error(error);
            return res.status(400).json({ error });
        }
        
        const userExists = await userService.getUserByEmail(email);
        if(userExists) {
            return res.status(402).json({ error: 'Email taken' });
        }

        const password = crypto.randomBytes(8).toString('hex');

        const hash = authService.hashPassword(password);

        const dayOfExams = await dayOfExamsService.getDayOfExams();
        const currentDate = new Date();

        try{
            const newUser = await userService.createUser({
                firstName,
                lastName,
                email,
                phone: null,
                dateOfBirth: null,
                password: hash,
                role: role as RoleEnum[],
                activatedAccount: false,
                deactivated: false,
                isSenior: false,
                adminCentre: centre as AdminCentreEnum[]
            });

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
            logger.info(`New user registered: ${newUser.email} by ${req.user?.firstName} ${req.user?.lastName}`);

            return res.status(201).json({ success: 'New user registered' });
        }
        catch(error){
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }
    },

    updateUserRole: async (req: URequest, res: Response) => {
        const { id, role } = req.body;
        
        if (!id || !role || id === '') {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }
        
        if (!Array.isArray(role) || role.length === 0) {
            return res.status(400).json({ error: 'Role should be a non-empty array' });
        }
    
        const invalidRoles = role.filter(r => !(r in RoleEnum));
        if (invalidRoles.length > 0) {
            return res.status(400).json({ error: `Invalid roles: ${invalidRoles.join(', ')}` });
        }
    
        try {
            const user = await userService.updateUserRoles(id, role as RoleEnum[]);
            logger.info(`User ${user.email} roles updated by ${req.user?.firstName} ${req.user?.lastName}`);
            return res.status(200).json({ success: 'User roles updated' });
        } catch (error) {
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
        const { location, adminCentre} = req.body;
        console.log(req.body);
        if (!location || location === '') {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }
        try {
            const centre = adminCentre as AdminCentreEnum[];
            const newLocation = await locationsService.addLocation(location, centre);
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
            //const location = await locationsService.deleteLocation(parseInt(id));
            const location = await locationsService.getLocationById(parseInt(id));
            if (!location) {
                return res.status(400).json({ error: 'Location not found' });
            }
            
            if(location.venues.length > 0){
                return res.status(400).json({ error: 'Location has venues' });
            }
            await locationsService.deleteLocation(parseInt(id));
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
    },

    updateUserSenior: async (req: URequest, res: Response) => {
        const { id, isSenior } = req.body;
        if (!id || id === '' || isSenior === undefined) {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }
        try {
            const user = await userService.updateSeniority(id, isSenior);
            logger.info(`User ${user.email} seniority updated by ${req.user?.firstName} ${req.user?.lastName}`);
            return res.status(200).json({ success: 'User seniority updated' });
        } catch (error) {
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }
    },

    updateUserLevel: async (req: URequest, res: Response) => {
        const { id, level } = req.body;

        if (!Array.isArray(level) || level.length === 0) {
            return res.status(400).json({ error: 'Level should be a non-empty array' });
        }
    
        const invalidLevels = level.filter(r => !(r in LevelEnum));
        if (invalidLevels.length > 0) {
            return res.status(400).json({ error: `Invalid roles: ${invalidLevels.join(', ')}` });
        }

        if (!id || id === '') {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }

        try {
            const user = await userService.updateUserLevels(id, level as LevelEnum[]);
            logger.info(`User ${user.email} levels updated by ${req.user?.firstName} ${req.user?.lastName}`);
            return res.status(200).json({ success: 'User levels updated' });
        } catch (error) {
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }
    },

    updateUserCentre: async (req: URequest, res: Response) => {
        const { id, adminCentre } = req.body;

        if (!Array.isArray(adminCentre) || adminCentre.length === 0) {
            return res.status(400).json({ error: 'Admin center should be a non-empty array' });
        }
    
        const invalidCenters = adminCentre.filter(r => !(r in AdminCentreEnum));
        if (invalidCenters.length > 0) {
            return res.status(400).json({ error: `Invalid centers: ${invalidCenters.join(', ')}` });
        }

        if (!id || id === '') {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }

        try {
            const user = await userService.updateUserAdminCentre(id, adminCentre as AdminCentreEnum[]);
            logger.info(`User ${user.email} admin center updated by ${req.user?.firstName} ${req.user?.lastName}`);
            return res.status(200).json({ success: 'User admin center updated' });
        } catch (error) {
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }
    }
}