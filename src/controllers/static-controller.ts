import { Response } from 'express';
import path from 'path';
import fs from 'fs';
import { URequest } from '../types/URequest';
import userService from '../services/user-service';

export default {
    getUsersAvatar: async (req: URequest, res: Response) => {
        const id = req.user?.id;
        if(!id) {
            return res.status(401).send('Unauthorized: Please login');
        }
        const user = await userService.getUserById(id);
        if(!user) {
            return res.status(404).send('User not found');
        }
        const image = user.avatarUrl;
        const imagePath = path.join(__dirname, `../../static/images/${image}`);
        if(fs.existsSync(imagePath)) {
            return res.sendFile(imagePath);
        }
        else {
          const defaultImagePath = path.join(__dirname, '../../static/images/testMan.jpg');
          if (fs.existsSync(defaultImagePath)) {
            return res.sendFile(defaultImagePath);
          }
          else {
            return res.status(404).send('Image not found');
          }
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