import {ResponseEnum, User} from '@prisma/client'
import {Request, Response} from 'express'
import userService from '../services/user-service'
import { MURequest } from '../types/URequest';
import sharp from 'sharp';
import logger from '../configs/logger';
import { log } from 'winston';

export default {
    updateAvatar: async (req: MURequest, res: Response) => {
        const userId = req.user?.id;
        const avatar = req.file;
        logger.info(avatar)

        if(!userId) {
            return res.status(401).json({ error: 'Please login' });
        }

        if(!avatar) {
            return res.status(400).json({ error: 'Please upload a file' });
        }

        try {
            await sharp(req.file?.path)
                .resize(300, 300)
                .jpeg({ quality: 100})
                .toFile(`static/resized_${req.file?.filename}`);
        } catch (err : any) {
            logger.error(err?.message);
            return res.status(500).send(err?.message);
        }

        const userExists = await userService.getUserById(userId);
        if(!userExists) {
            return res.status(401).json({ error: 'User does not exists' });
        }

        await userService.updateAvatarUrl(userId, avatar.filename);

        return res.status(200).json({ message: 'Avatar updated' });
    }
}