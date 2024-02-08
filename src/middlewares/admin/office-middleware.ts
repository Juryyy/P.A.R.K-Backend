import { URequest } from "../../types/URequest";
import { Response, NextFunction } from "express";
import { User, RoleEnum} from "@prisma/client";

export default {
    isOffice: async (req: URequest, res: Response, next: NextFunction) => {
        const user = req.user as User;
        if(user.role !== RoleEnum.Office ) {
            return res.status(403).json({ error: 'You dont have office role' });
        }
        next();
    }
}