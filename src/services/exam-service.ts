import { PrismaClient, User, Exam, LevelEnum, TypeOfExamEnum } from "@prisma/client";
import { remove } from "winston";
import _, { get } from 'lodash';

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

    async updateExam(id: number, venue : string, location : string, type : TypeOfExamEnum, levels: LevelEnum[] , startTime : Date, endTime : Date, note :string, schedule?: string){
        return await prisma.exam.update({
            where: {
                id,
            },
            data: {
                venue,
                location,
                type,
                levels,
                startTime,
                endTime,
                note,
                schedule,
            },
        });
    },

    async getExamById(id: number) {
        const exam = await prisma.exam.findUnique({
          where: { id },
          include: {
            supervisors: true,
            invigilators: true,
            examiners: true,
            candidates: true,
            files: true,
            dayReport: true,
            userConfirmations: true,
          },
        });
      
        if (!exam) return null;
      
        // Exclude specific fields from related entities
        const sanitizedExam = {
          ...exam,
          supervisors: exam.supervisors.map((supervisor) =>
            _.omit(supervisor, ['password', 'noteLonger'])
          ),
          invigilators: exam.invigilators.map((invigilator) =>
            _.omit(invigilator, ['password', 'noteLonger'])
          ),
          examiners: exam.examiners.map((examiner) =>
            _.omit(examiner, ['password', 'noteLonger'])
          ),
        };
      
        return sanitizedExam;
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
            include: {
                userConfirmations: true,
            },
        });
    },

    async deleteExam(id: number) {
        return await prisma.exam.delete({
            where: {
                id,
            },
        });
    },

    async updateCompleted(id: number, completed: boolean) {
        return await prisma.exam.update({
            where: {
                id,
            },
            data: {
                isCompleted: completed,
            },
        });
    },

    async updatePrepared(id: number, prepared: boolean) {
        return await prisma.exam.update({
            where: {
                id,
            },
            data: {
                isPrepared: prepared,
            },
        });
    },

    async getExamsByDay(dayOfExamsId: number) {
        return await prisma.exam.findMany({
            where: {
                dayOfExamsId,
            },
        });
    }

}