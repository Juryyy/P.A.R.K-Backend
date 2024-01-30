import express, { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { jwtAccessVerify } from '../middlewares/tokenVerify-middleware';
import staticController from '../controllers/static-controller';

const router = express.Router();

router.get('/images/avatar',jwtAccessVerify, staticController.getUsersAvatar);

export default router;