import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { URequest } from '../types/URequest';
import fs from 'fs/promises';
import userService from '../services/user-service';

const UPLOAD_DIR = 'static/images';

// Use memory storage instead of disk storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image.'));
        }
    },
}).single('avatar');

export const processAndSaveAvatar = async (req: URequest, res: Response, next: NextFunction) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Error uploading avatar:', err);
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            console.error('No file uploaded');
            return res.status(400).json({ error: "No file uploaded" });
        }

        const userId = req.user?.id;
        if (!userId) {
            console.error('Unauthorized: Please login');
            return res.status(401).json({ error: "Unauthorized: Please login" });
        }

        const filename = `${userId}_${uuidv4()}.jpg`;
        const filePath = path.join(UPLOAD_DIR, filename);

        try {
            await sharp(req.file.buffer)
                .resize(300, 300)
                .jpeg({ quality: 90 })
                .toFile(filePath);

            const user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            if (user.avatarUrl) {
                const oldAvatarPath = path.join(UPLOAD_DIR, user.avatarUrl);
                await fs.unlink(oldAvatarPath).catch(err => console.warn(`Failed to delete old avatar: ${err.message}`));
            }

            await userService.updateAvatarUrl(userId, filename);

            res.status(200).json({ message: "Avatar updated successfully", avatarUrl: filename });
        } catch (error) {
            console.error('Error processing and saving avatar:', error);
            res.status(500).json({ error: "Internal server error: Failed to process and save avatar" });
        }
    });
};