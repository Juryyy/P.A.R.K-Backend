import { DayOfExams, PrismaClient, User, Response, Exam} from "@prisma/client";

const prisma = new PrismaClient();

export default {
    async createDayOfExams(date: Date) {
        return await prisma.dayOfExams.create({
            data: {
                date: date
            }
        });
    },

    async getDayOfExamsById(id: number) {
        return await prisma.dayOfExams.findUnique({
            where: {
                id: id
            }
        });
    },

    async getDayOfExams() {
        return await prisma.dayOfExams.findMany();
    },

    async getDayOfExamsByDate(date: Date) {
        return await prisma.dayOfExams.findFirst({
            where: {
                date: date
            }
        });
    },

    async removeDayOfExamsById(id: number) {
        return await prisma.dayOfExams.delete({
            where: {
                id: id
            }
        });
    },

}