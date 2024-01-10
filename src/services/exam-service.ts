import { PrismaClient, User, Exam, LevelEnum, TypeOfExamEnum } from "@prisma/client";

const prisma = new PrismaClient();

export default {

    async getAllExams(){
        return await prisma.exam.findMany();
    },

    async createExam(venue : string , type : TypeOfExamEnum, levels: LevelEnum[] , startTime : Date, endTime : Date, note :string , dayOfExamsId : number){
        return await prisma.exam.create({
            data: {
                venue,
                type,
                levels,
                startTime,
                endTime,
                note,
                dayOfExamsId,
            },
        });
    }
}