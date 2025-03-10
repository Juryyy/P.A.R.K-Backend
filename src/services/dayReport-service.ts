import { PrismaClient, Prisma, DayReport} from "@prisma/client";

const prisma = new PrismaClient();

export default {
    async createDayReport(data : Prisma.DayReportCreateInput){
        return await prisma.dayReport.create({
            data
        });
    },

    async getDayReports(){
        return await prisma.dayReport.findMany();
    },

    async getDayReportById(id : number){
        return await prisma.dayReport.findUnique({
            where : {
                id
            }
        });
    },

    async getDayReportByExamId(examId : number){
        return await prisma.dayReport.findFirst({
            where : {
                examId
            }
        });
    },

    async deleteDayReport(id : number){
        return await prisma.dayReport.delete({
            where : {
                id
            }
        });
    }
    
}