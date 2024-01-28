import { DayOfExams, PrismaClient, User, Response, Exam} from "@prisma/client";

const prisma = new PrismaClient();

export default {
    async createDayOfExams(date: Date, isForInvigilators: boolean, isForExaminers: boolean) {
        return await prisma.dayOfExams.create({
            data: {
                date: date,
                isForInvigilators: isForInvigilators,
                isForExaminers: isForExaminers
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

    async getDayOfExamsForInvigilators() {
        return await prisma.dayOfExams.findMany({
            where: {
                isForInvigilators: true
            }
        });
    },

    async getDayOfExamsForExaminers() {
        return await prisma.dayOfExams.findMany({
            where: {
                isForExaminers: true
            }
        });
    },

    async deleteDayOfExams(id: number) {
        await prisma.exam.deleteMany({
            where: {
                dayOfExamsId: id
            }
        });
    
        return await prisma.dayOfExams.delete({
            where: {
                id: id
            }
        });
    },

}