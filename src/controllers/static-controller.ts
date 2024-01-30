import { Response } from 'express';
import path from 'path';
import fs from 'fs';
import { URequest } from '../types/URequest';

export default {
    getUsersAvatar: async (req: URequest, res: Response) => {
        const image = req.user?.avatarUrl
        const imagePath = path.join(__dirname, `../../static/images/${image}`);
        if(fs.existsSync(imagePath)) {
            return res.sendFile(imagePath);
        }
        else {
            return res.status(404).send('Image not found');
        }
    }
}