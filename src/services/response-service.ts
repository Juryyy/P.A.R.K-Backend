import { PrismaClient, ResponseEnum, RoleEnum } from "@prisma/client";

const prisma = new PrismaClient();

async function createResponses(dayOfExamsId: number, userId: number, response: ResponseEnum) {
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
        return await createResponses(dayOfExamsId, userId, response);
    },

    async createResponsesForDay(dayOfExamsId: number, isForInvigilators: boolean, isForExaminers: boolean) {
        const rolesForInvigilators = [
            RoleEnum.Invigilator,
            RoleEnum.Supervisor,
            RoleEnum.Office
        ];
        
        const rolesForExaminers = [RoleEnum.Examiner];

        let users: any[] = [];
        
        if (isForInvigilators) {
            users = users.concat(await prisma.user.findMany({
                where: {
                    role: {
                        hasSome: rolesForInvigilators
                    }
                }
            }));
        }

        if (isForExaminers) {
            users = users.concat(await prisma.user.findMany({
                where: {
                    role: {
                        hasSome: rolesForExaminers
                    }
                }
            }));
        }

        const uniqueUsers = Array.from(new Set(users.map(u => u.id)))
            .map(id => {
                return users.find(u => u.id === id)
            });

        const dayOfExams = await prisma.dayOfExams.findUnique({
            where: {
                id: dayOfExamsId
            }
        });

        for (let user of uniqueUsers) {
            if(user.adminCentre.includes(dayOfExams?.adminCentre)) 
                await createResponses(dayOfExamsId, user.id, ResponseEnum.No);
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

    async assign(dayOfExamsId: number, userId: number) {
        return await prisma.response.update({
            where: {
                dayOfExamsId_userId: {
                    dayOfExamsId: dayOfExamsId,
                    userId: userId
                }
            },
            data: {
                assigned: true
            }
        });
    },

    async unAssign(dayOfExamsId: number, userId: number) {
        return await prisma.response.update({
            where: {
                dayOfExamsId_userId: {
                    dayOfExamsId: dayOfExamsId,
                    userId: userId
                }
            },
            data: {
                assigned: false
            }
        });
    },
     
}