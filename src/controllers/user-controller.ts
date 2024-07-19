import {ResponseEnum, User} from '@prisma/client'
import {Request, Response} from 'express'
import userService from '../services/user-service'
import { MURequest, URequest } from '../types/URequest';
import sharp from 'sharp';
import logger from '../configs/logger';
import util from 'util';
import fs from 'fs';

const unlink = util.promisify(fs.unlink); // Promisify the unlink function

export default {
    updateAvatar: async (req: MURequest, res: Response) => {
        const userId = req.user?.id;
        const avatar = req.file;

        if(!userId) {
            return res.status(401).json({ error: 'Please login' });
        }

        if(!avatar) {
            return res.status(400).json({ error: 'Please upload a file' });
        }

        const userExists = await userService.getUserById(userId);
        if(!userExists) {
            return res.status(402).json({ error: 'User does not exists' });
        }

        try {
            await sharp(req.file?.path)
                .resize(300, 300)
                .jpeg({ quality: 100})
                .toFile(`static/images/resized_${req.file?.filename}`);

        } catch (err : any) {
            logger.error(err?.message);
            return res.status(500).send(err?.message);
        }

        if (userExists.avatarUrl) {
            try {
                await unlink(`static/images/${userExists.avatarUrl}`);
            } catch (err) {
                logger.error(err);
            }
        }

        try{
            await userService.updateAvatarUrl(userId, avatar.filename);
            return res.status(200).json({ message: 'Avatar updated' });
        }catch(error){
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }
    },

    getAllUsers: async (req: URequest, res: Response) => {
        const users = await userService.getAllUsers();
        return res.status(200).json(users);
    },

    getProfile: async (req: URequest, res: Response) => {
        const profileId = Number(req.params.id);

        if(!profileId) {
            return res.status(400).json({ error: 'Invalid data' });
        }

        const user = await userService.getProfileById(profileId);
        if(!user) {
            return res.status(404).json({ error: 'User does not exists' });
        }
        return res.status(200).json(user);
    },

    getUserInfo: async (req: URequest, res: Response) => {
        const userId = req.user?.id;

        if(!userId) {
            return res.status(401).json({ error: 'Please login' });
        }

        const user = await userService.getUserById(userId);
        if(!user) {
            return res.status(404).json({ error: 'User does not exists' });
        }

        const { password: pass, ...userWithoutPassword } = user;
        console.log(userWithoutPassword)
        return res.status(200).json(userWithoutPassword);
    },

}