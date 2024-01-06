import { PrismaClient, ResponseEnum } from "@prisma/client";

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
}