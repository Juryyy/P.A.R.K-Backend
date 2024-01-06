import multer from 'multer';
import { URequest } from '../configs/URequest';

const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'static/');
    },
    filename: (req: URequest, file, cb) => {
        cb(null, req.user?.id + '.jpg');
    }
});


export const uploadAvatar = multer({ storage: avatarStorage }).single('avatar');