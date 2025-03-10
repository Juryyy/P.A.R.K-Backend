import express from 'express';
import authController from '../controllers/auth-controller';
import { jwtAccessVerify, jwtRefreshVerify } from '../middlewares/tokenVerify-middleware';

const router = express.Router();

//router.post('/register', authController.register);
router.post('/login', authController.tfalogin);
router.post('/verify', authController.verify);
router.post('/refresh-token', jwtRefreshVerify, authController.refreshTokens);
router.delete('/logout', authController.logout)
router.post('/password-update', jwtAccessVerify, authController.passwordUpdate)
router.post('/password-reset', authController.passwordReset)
router.get('/token', jwtAccessVerify, authController.token)

export default router;