import { PrismaClient, ResponseEnum, RoleEnum } from "@prisma/client";

const prisma = new PrismaClient();

async function createResponse(dayOfExamsId: number, userId: number, response: ResponseEnum) {
    return await prisma.response.create({
        data: {
            dayOfExamsId: dayOfExamsId,
            userId: userId,
            response: response
        }
    });
}

export default {
    async createResponse(dayOfExamsId: number, userId: number, response: ResponseEnum) {
        return await createResponse(dayOfExamsId, userId, response);
    },

    async createResponsesForDay(dayOfExamsId: number) {
        const users = await prisma.user.findMany();
        for (let user of users) {
            await createResponse(dayOfExamsId, user.id, ResponseEnum.No);
        }
    },

    async createResponsesForDayInvigilators(dayOfExamsId: number) {
        const users = await prisma.user.findMany({
            where: {
                role: {
                    in: [
                        RoleEnum.Invigilator,
                        RoleEnum.SeniorInvigilator,
                        RoleEnum.Supervisor,
                        RoleEnum.SeniorSupervisor,
                        RoleEnum.Office
                    ]
                }
            }
        });
        for (let user of users) {
            await createResponse(dayOfExamsId, user.id, ResponseEnum.No);
        }
    },

    async createResponsesForDayExaminers(dayOfExamsId: number) {
        const users = await prisma.user.findMany({
            where: {
                role: RoleEnum.Examiner
            }
        });
        for (let user of users) {
            await createResponse(dayOfExamsId, user.id, ResponseEnum.No);
        }

    },

    async updateResponse(dayOfExamsId: number, userId: number, response: ResponseEnum) {
        return await prisma.response.update({
            where: {
                dayOfExamsId_userId: {
                    dayOfExamsId: dayOfExamsId,
                    userId: userId
                }
            },
            data: {
                response: response
            }
        });
    },

    async getResponsesForDay(dayOfExamsId: number) {
        return await prisma.response.findMany({
            where: {
                dayOfExamsId: dayOfExamsId
            }
        });
    },

    async getResponsesForUser(userId: number) {
        return await prisma.response.findMany({
            where: {
                userId: userId
            }
        });
    },

    async getResponseByExamIDAndUserId(dayOfExamsId: number, userId: number) {
        return await prisma.response.findUnique({
            where: {
                dayOfExamsId_userId: {
                    dayOfExamsId: dayOfExamsId,
                    userId: userId
                }
            }
        });
    },

    async getResponseById(id: number) {
        return await prisma.response.findUnique({
            where: {
                id: id
            }
        });
    },

   async getUsersWithYesResponseForDayOfExams(dayOfExamsId: number)  {
        const responses = await prisma.response.findMany({
          where: {
            dayOfExamsId: dayOfExamsId,
            response: ResponseEnum.Yes
          },
          include: {
            user: true
          }
        });      
        return responses;
      },

    async deleteResponsesForDay(dayOfExamsId: number) {
        return await prisma.response.deleteMany({
            where: {
                dayOfExamsId: dayOfExamsId
            }
        });
    },

     
}