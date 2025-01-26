import jwt from 'jsonwebtoken';
import { Response } from 'express';
import userService from "../services/user-service";
import { User } from '@prisma/client';

export const createToken = (user: Omit<User, 'password'>, secret: string, expiresIn: string) => {
    return jwt.sign({ user }, secret, { expiresIn });
}
