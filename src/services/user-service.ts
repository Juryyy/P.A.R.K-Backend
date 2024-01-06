import {User, RoleEnum, PrismaClient} from '@prisma/client';
import logger from '../configs/logger';

const prisma = new PrismaClient();

export default {
    async getUserByEmail(email : string){
        return await prisma.user.findUnique({
            where: {
                email: email
            }
        });
    },

    async createUser(user : Omit<User, "id" | "drivingLicense" | "adminNote" | "note" | "avatarUrl" >){
        return await prisma.user.create({
            data: user
        });
    },

    async getUserById(id : number){
        return await prisma.user.findUnique({
            where: {
                id: id
            }
        });
    },

    async activateAccount(id : number){
        return await prisma.user.update({
            where: {
                id: id
            },
            data: {
                activatedAccount: true
            }
        });
    },

    async changeInfo(id : number, firstName? : string, lastName? : string, drivingLicense? : boolean, note? : string, email? : string){
        const user = await prisma.user.findUnique({ where: { id: id } });
        if(!user) {
            logger.error(`User with id ${id} does not exists`);
            throw new Error(`User with id ${id} does not exists`);
        }
        return await prisma.user.update({
            where: { 
                id: id 
            },
            data: {
                firstName: firstName ?? user.firstName,
                lastName: lastName ?? user.lastName,
                drivingLicense: drivingLicense ?? user.drivingLicense,
                note: note ?? user.note
            }
        });
    },

    async updateAvatarUrl(id : number, avatarUrl : string){
        return await prisma.user.update({
            where: { id: id },
            data: {
                avatarUrl: avatarUrl
            }
        });
    }

}
