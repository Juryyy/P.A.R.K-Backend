import { Prisma, PrismaClient, } from "@prisma/client";
import logger from "../configs/logger";

const prisma = new PrismaClient();

export default {
    async createDateLock(when : Date, first: Date, last : Date){
        return await prisma.dateLock.create({
            data : {
                when,
                first,
                last
            }
        });
    },

    async getDateLock(when : Date){
        return await prisma.dateLock.findFirst({
            where : {
                when
            }
        });
    },

    async getDateLocks(){
        return await prisma.dateLock.findMany();
    },

    async deleteDateLock(when : Date){
        return await prisma.dateLock.delete({
            where : {
                when
            }
        });
    },


}