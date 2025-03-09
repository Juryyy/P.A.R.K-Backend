import { DayOfExams, PrismaClient, User, Response, Exam, AdminCentreEnum} from "@prisma/client";

const prisma = new PrismaClient();

export default {
    async createDayOfExams(date: Date, isForInvigilators: boolean, isForExaminers: boolean, centre : AdminCentreEnum) {
        return await prisma.dayOfExams.create({
            data: {
                date: date,
                isForInvigilators: isForInvigilators,
                isForExaminers: isForExaminers,
                adminCentre: centre
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

    async getDayOfExamsByCentre(centre: AdminCentreEnum) {
        return await prisma.dayOfExams.findMany({
            where: {
                adminCentre: centre
            }
        });
    },

    async getDayOfExamsInRange(startDate: Date, endDate: Date, centre: AdminCentreEnum) {
        return await prisma.dayOfExams.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate,
                },
                adminCentre: centre
            }
        });
    },

    async getDayOfExamsByDate(date: Date, centre: AdminCentreEnum) {
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

    async getDayOfExamsForInvigilators(center: AdminCentreEnum) {
        return await prisma.dayOfExams.findMany({
            where: {
                isForInvigilators: true,
                adminCentre: center
            }
        });
    },

    async getDayOfExamsForExaminers(center: AdminCentreEnum) {
        return await prisma.dayOfExams.findMany({
            where: {
                isForExaminers: true,
                adminCentre: center
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

    async changeLock(id: number) {
        const dayOfExams = await prisma.dayOfExams.findUnique({
            where: {
                id: id
            }
        });

        return await prisma.dayOfExams.update({
            where: {
                id: id
            },
            data: {
                isLocked: !dayOfExams?.isLocked
            }
        });
    },

    async lockDayOfExams(id: number) {
        return await prisma.dayOfExams.update({
            where: {
                id: id
            },
            data: {
                isLocked: true
            }
        });
    },
}