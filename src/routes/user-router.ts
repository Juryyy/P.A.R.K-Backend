import express from 'express';
import { jwtAccessVerify } from '../middlewares/tokenVerify-middleware';
import { uploadAvatar } from '../configs/user-config';
import userController from '../controllers/user-controller';
import examController from '../controllers/exam-controller';
import client from '../configs/onedrive';

const router = express.Router();

router.post('/upload', jwtAccessVerify, uploadAvatar, userController.updateAvatar);
router.get('/usersExams', jwtAccessVerify, examController.getUsersExams);
router.get('/allUsers', jwtAccessVerify, userController.getAllUsers);
router.get('/profile/:id', jwtAccessVerify, userController.getProfile);

function convertSharingUrlToSharingId(sharingUrl: string): string {
    const base64Url = Buffer.from(sharingUrl, 'utf8').toString('base64');
    return base64Url.replace(/\//g, '_').replace(/\+/g, '-');
  }
  
  async function downloadFile(sharingUrl: string): Promise<Buffer> {
    const sharingId = convertSharingUrlToSharingId(sharingUrl);
    const driveItem = await client
      .api(`/shares/${sharingId}/driveItem/content`)
      .get();
  
    return driveItem;
  }
  
  router.get('/onedrive/download', async (req, res) => {
    const sharingUrl = 'https://1drv.ms/t/s!AvtJhjm7APO_hG-TydJMtBl5Hfqg?e=bxqv9S';
    const file = await downloadFile(sharingUrl);
  
    res.send(file);
  });

//https://1drv.ms/t/s!AvtJhjm7APO_hG-TydJMtBl5Hfqg?e=bxqv9S
export default router;