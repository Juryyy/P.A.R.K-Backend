import express from 'express';
import authController from '../controllers/auth-controller';
import { jwtAccessVerify, jwtRefreshVerify } from '../middlewares/tokenVerify-middleware';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', jwtRefreshVerify, authController.refreshTokens);
router.delete('/logout', authController.logout)

export default router;