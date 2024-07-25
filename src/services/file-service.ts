import { PrismaClient, Prisma, File} from "@prisma/client";

const prisma = new PrismaClient();

export default {
    async createFile(data : Prisma.FileCreateInput){
        return await prisma.file.create({
            data
        });
    },

    async getFiles(){
        return await prisma.file.findMany();
    },

    async getFileById(id : number){
        return await prisma.file.findUnique({
            where : {
                id
            }
        });
    },
}