import { PrismaClient, User, Exam, LevelEnum, TypeOfExamEnum } from "@prisma/client";
import { remove } from "winston";

const prisma = new PrismaClient();

export default {

    async getAllExams(){
        return await prisma.exam.findMany();
    },

    async createExam(venue : string, location : string, type : TypeOfExamEnum, levels: LevelEnum[] , startTime : Date, endTime : Date, note :string , dayOfExamsId : number){
        return await prisma.exam.create({
            data: {
                venue,
                location,
                type,
                levels,
                startTime,
                endTime,
                note,
                dayOfExamsId,
            },
        });
    },

    async getExamById(id: number){
        return await prisma.exam.findUnique({
            where: {
                id,
            },
            include: {
                supervisors: true,
                invigilators: true,
                examiners: true,
                candidates: true,
            },
        });
    },

    async addSupervisor(examId: number, userId: number) {
        return await prisma.exam.update({
            where: {
                id: examId,
            },
            data: {
                supervisors: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    },

    async removeSupervisor(examId: number, userId: number) {
        return await prisma.exam.update({
            where: {
                id: examId,
            },
            data: {
                supervisors: {
                    disconnect: {
                        id: userId,
                    },
                },
            },
        });
    },

    async addInvigilator(examId: number, userId: number) {
        return await prisma.exam.update({
            where: {
                id: examId,
            },
            data: {
                invigilators: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    },

    async removeInvigilator(examId: number, userId: number) {
        return await prisma.exam.update({
            where: {
                id: examId,
            },
            data: {
                invigilators: {
                    disconnect: {
                        id: userId,
                    },
                },
            },
        });
    },

    async addExaminer(examId: number, userId: number) {
        return await prisma.exam.update({
            where: {
                id: examId,
            },
            data: {
                examiners: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    },

    async removeExaminer(examId: number, userId: number) {
        return await prisma.exam.update({
            where: {
                id: examId,
            },
            data: {
                examiners: {
                    disconnect: {
                        id: userId,
                    },
                },
            },
        });
    },

    async getSupervisorsByExamId(examId: number) {
        return await prisma.exam.findUnique({
            where: {
                id: examId,
            },
            include: {
                supervisors: true,
            },
        });
    },

    async getInvigilatorsByExamId(examId: number) {
        return await prisma.exam.findUnique({
            where: {
                id: examId,
            },
            include: {
                invigilators: true,
            },
        });
    },

    async getExaminersByExamId(examId: number) {
        return await prisma.exam.findUnique({
            where: {
                id: examId,
            },
            include: {
                examiners: true,
            },
        });
    },

    async addPdfUrl(examId: number, pdfUrl: string) {
        return await prisma.exam.update({
            where: {
                id: examId,
            },
            data: {
                pdfUrl,
            },
        });
    },

    async getUpcomingExams() {
        return await prisma.exam.findMany({
            where: {
                startTime: {
                    gte: new Date(),
                },
            },
        });
    },

    async getUpcomingExamsWithEverything(){
        return await prisma.exam.findMany({
            where: {
                startTime: {
                    gte: new Date(),
                },
            },
            include: {
                supervisors: true,
                invigilators: true,
                examiners: true,
                candidates: true,
            },
        });
    },

    async getExamsForUser(userId: number) {
        return await prisma.exam.findMany({
            where: {
                OR: [
                    {
                        supervisors: {
                            some: {
                                id: userId,
                            },
                        },
                    },
                    {
                        invigilators: {
                            some: {
                                id: userId,
                            },
                        },
                    },
                    {
                        examiners: {
                            some: {
                                id: userId,
                            },
                        },
                    },
                ],
            },
        });
    }

}