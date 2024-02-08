import multer from 'multer';
import { URequest } from '../types/URequest';

const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/images/');
    },
    filename: function (req: URequest, file, cb) {
        cb(null, req.user?.id + '.jpg');
    },
});

const upload = multer({
    storage: avatarStorage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    },
});

export const uploadAvatar = upload.single('avatar');