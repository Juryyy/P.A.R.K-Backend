import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from 'jsonwebtoken';
import { accessJwtSecret, refreshJwtSecret} from '../configs/jwt-config';
import { User } from "@prisma/client";
import { URequest } from "../types/URequest";


const jwtAccessVerify = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    if (token) {
        try {
            const decoded = jwt.verify(token, accessJwtSecret as Secret);
            (req as URequest).user = decoded as User; 
            next(); 
        } catch (error) {
            res.status(401).json({ message: "Invalid or expired token" }); 
        }
    } else {
        res.status(401).json({ message: "No token provided" }); 
    }
}

const jwtRefreshVerify = (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, refreshJwtSecret as Secret);
            (req as URequest).user = decoded as User; 
            next(); 
        } catch (error) {
            res.status(401).json({ message: "Invalid or expired refresh token" }); 
        }
    } else {
        res.status(401).json({ message: "No refresh token provided" }); 
    }
}

export { jwtAccessVerify, jwtRefreshVerify }