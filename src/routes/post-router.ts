import express from 'express';
import officeMiddleware from '../middlewares/admin/office-middleware';
import { jwtAccessVerify } from '../middlewares/tokenVerify-middleware';
import postController from '../controllers/post-controller';

const router = express.Router();

router.post('/create', jwtAccessVerify, officeMiddleware.isOffice, postController.createPost);
router.get('/posts', jwtAccessVerify, postController.getPostsForUser);
//router.get('/post/:id', jwtAccessVerify, officeMiddleware.isOffice);
//router.put('/update/:id', jwtAccessVerify, officeMiddleware.isOffice);
//router.delete('/delete/:id', jwtAccessVerify, officeMiddleware.isOffice);

export default router;