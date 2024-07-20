import {User, RoleEnum, PrismaClient, LevelEnum} from '@prisma/client';
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
    async updateUserProfile(id: number, email: string, firstName: string, lastName: string, dateOfBirth : Date,  note : string, noteLonger : string, drivingLicense : boolean, phone : string){
        return await prisma.user.update({
            where: {
                id: id
            },
            data: {
                email: email,
                phone: phone,
                note: note,
                firstName: firstName,
                lastName: lastName,
                noteLonger: noteLonger,
                drivingLicense: drivingLicense,
                dateOfBirth: dateOfBirth
            }
        });
    },

    async createUser(user : Omit<User, "id" | "drivingLicense" | "adminNote" | "note" | "avatarUrl" | "noteLonger" | "level" >){
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
    },

    async getAllUsers(){
        return await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                drivingLicense: true,
                phone: true,
                note: true,
                adminNote: true,
                role: true,
                avatarUrl: true,
                activatedAccount: true,
                deactivated: true,
                dateOfBirth: true,
                noteLonger: true,
                level: true,
                isSenior: true,
                _count: {
                    select: {
                        supervisedExams: true,
                        invigilatedExams: true,
                        examinedExams: true
                    }
                }
            }
        });
    },

    async updateUserRoles(id : number, roles : RoleEnum[]){
        return await prisma.user.update({
            where: {
                id: id
            },
            data: {
                role: roles
            }
        });
    },

    async getProfileById(id : number){
        return await prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                drivingLicense: true,
                phone: true,
                note: true,
                adminNote: true,
                role: true,
                avatarUrl: true,
                activatedAccount: true,
                deactivated: true,
                dateOfBirth: true,
                noteLonger: true,
                level: true,
                isSenior: true,
                _count: {
                    select: {
                        supervisedExams: true,
                        invigilatedExams: true,
                        examinedExams: true
                    }
                }
            }
        });
    },

    async tagUserToPost(postId : number, userId : number){
        return await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                posts: {
                    connect: {
                        id: postId
                    }
                }
            }
        });
    },

    async tagUserToTaggedPost(postId : number, userId : number){
        return await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                taggedPosts: {
                    connect: {
                        id: postId
                    }
                }
            }
        });
    },

    async updatePassword(id : number, password : string){
        return await prisma.user.update({
            where: {
                id: id
            },
            data: {
                password: password
            }
        });
    },

    async updateSeniority(id : number, isSenior : boolean){
        return await prisma.user.update({
            where: {
                id: id
            },
            data: {
                isSenior: isSenior
            }
        });
    },

    async updateUserLevels(id : number, levels : LevelEnum[]){
        return await prisma.user.update({
            where: {
                id: id
            },
            data: {
                level: levels
            }
        });
    }

}
