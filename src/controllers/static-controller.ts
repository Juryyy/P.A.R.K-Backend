import { Response } from 'express';
import path from 'path';
import fs from 'fs';
import { URequest } from '../types/URequest';
import userService from '../services/user-service';

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
    },

    getUserAvatarByID: async (req: URequest, res: Response) => {
    const userId = parseInt(req.params.id);
    const user = await userService.getUserById(userId);

    if(!user) {
      return res.status(404).send('User not found');
    }

    const image = user.avatarUrl;
    const imagePath = path.join(__dirname, `../../static/images/${image}`);

    if (fs.existsSync(imagePath)) {
      return res.sendFile(imagePath);
    } else {
      return res.status(404).send('Image not found');
    }
  }
}