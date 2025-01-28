import { AdminCentreEnum, Prisma, PrismaClient, } from "@prisma/client";
import logger from "../configs/logger";

const prisma = new PrismaClient();

export default {
    async createDateLock(when : Date, first: Date, last : Date, centre : AdminCentreEnum){
        return await prisma.dateLock.create({
            data : {
                when,
                first,
                last,
                adminCentre : centre
            }
        });
    },

    async getDateLock(when : Date, adminCentre : AdminCentreEnum){
        return await prisma.dateLock.findFirst({
            where : {
                when,
                adminCentre
            }
        });
    },

    async getDateLocks(){
        return await prisma.dateLock.findMany();
    },

    async getDateLocksByCentre(adminCentre : AdminCentreEnum){
        return await prisma.dateLock.findMany({
            where : {
                adminCentre
            }
        });
    },

    async deleteDateLock(when : Date, adminCentre : AdminCentreEnum){
        return await prisma.dateLock.delete({
            where : {
                when,
                adminCentre
            }
        });
    },


}