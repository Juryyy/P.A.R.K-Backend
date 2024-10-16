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

    async getOrCreateConfirmation(examId: number, userId: number, role: RoleEnum) {
        try {
          let confirmation = await prisma.examUserConfirmation.findFirst({
            where: {
              examId,
              userId,
              role
            }
          });
    
          if (!confirmation) {
            confirmation = await prisma.examUserConfirmation.create({
              data: {
                examId,
                userId,
                role,
                isConfirmed: false
              }
            });
          }
    
          return confirmation;
        } catch (e) {
          logger.error(e);
          throw e;
        }
      },
    
      async updateConfirmation(examId: number, userId: number, role: RoleEnum, isConfirmed: boolean) {
        try {
          return await prisma.examUserConfirmation.upsert({
            where: {
              examId_userId_role: {
                examId,
                userId,
                role
              }
            },
            update: {
              isConfirmed: isConfirmed,
              confirmedAt: isConfirmed ? new Date() : null
            },
            create: {
              examId,
              userId,
              role,
              isConfirmed: isConfirmed,
              confirmedAt: isConfirmed ? new Date() : null
            }
          });
        } catch (e) {
          logger.error('Failed to update confirmation:', e);
          throw e;
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
    },

    async deleteConfirmationsByExamId(examId: number) {
        try {
            return await prisma.examUserConfirmation.deleteMany({
                where: {
                    examId
                }
            });
        } catch (e) {
            console.error(e);
        }
    },
}