import {User, Role, PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default {
    async getUserByEmail(email : string){
        return await prisma.user.findUnique({
            where: {
                email: email
            }
        });
    },

    //create user but remove id, driving license from the parameter
    async createUser(user : Omit<User, "id" | "drivingLicense" | "adminNote" | "note" | "avatarUrl" >){
        return await prisma.user.create({
            data: user
        });
    },

    async getUserById(id : number){
        return await prisma.user.findUnique({
            where: {
                id: id
            }
        });
    },

}
