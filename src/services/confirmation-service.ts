import { Prisma, PrismaClient, ExamUserConfirmation, RoleEnum } from "@prisma/client";
import logger from "../configs/logger";

const prisma = new PrismaClient();

export default {
    async createConfirmation(examId: number, userId: number, role: RoleEnum, isConfirmed: boolean) {
        try {
            const data: any = {
                examId,
                userId,
                role,
                isConfirmed
            };
    
            if (isConfirmed) {
                data.confirmedAt = new Date();
            }
    
            return await prisma.examUserConfirmation.create({
                data
            });
        } catch (e) {
            logger.error(e);
        }
    },

    async getConfirmation(data: Prisma.ExamUserConfirmationWhereUniqueInput) {
        try {
            return await prisma.examUserConfirmation.findUnique({
                where: data
            });
        } catch (e) {
            console.error(e);
        }
    },

    async updateConfirmation(data: Prisma.ExamUserConfirmationUncheckedUpdateInput) {
        try {
            return await prisma.examUserConfirmation.update({
                where: { id: data.id as number },
                data
            });
        } catch (e) {
            console.error(e);
        }
    },

    async deleteConfirmation(data: Prisma.ExamUserConfirmationWhereUniqueInput) {
        try {
            return await prisma.examUserConfirmation.delete({
                where: data
            });
        } catch (e) {
            console.error(e);
        }
    }
}