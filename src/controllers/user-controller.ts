import {ResponseEnum, User} from '@prisma/client'
import {Request, Response} from 'express'
import userService from '../services/user-service'
import { MURequest } from '../configs/URequest';

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
            return res.status(401).json({ error: 'User does not exists' });
        }
    
        await userService.updateAvatarUrl(userId, avatar.filename);
    
        return res.status(200).json({ message: 'Avatar updated' });
    }
}