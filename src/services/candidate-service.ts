import { Prisma, PrismaClient, } from "@prisma/client";
import logger from "../configs/logger";

const prisma = new PrismaClient();

export default {
    async createCandidate(data : Prisma.CandidateCreateInput) {
        try{
            return await prisma.candidate.create({
                data
            });
        }catch(e){
            logger.error(e);
        }
    },

    async getCandidate(data: Prisma.CandidateWhereUniqueInput) {
        try{
            return await prisma.candidate.findUnique({
                where: data
            });
        }catch(e){
            logger.error(e);
        }
    },

    async createImportedCandidate(data: Prisma.ImportedCandidateCreateInput){
        try{
            return await prisma.importedCandidate.create({
                data
            });
        }catch(e){
            logger.error(e);
        }
    }
}