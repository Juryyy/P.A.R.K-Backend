import { Post, PrismaClient, Prisma, User, DriveLink} from "@prisma/client";

const prisma = new PrismaClient();

export default {
    async createPost(data : Prisma.PostCreateInput){
        return await prisma.post.create({
            data
        });
    },

    async getPosts(){
        return await prisma.post.findMany();
    },

    async getPostsForUser(userId : number){
        return await prisma.post.findMany({
            where : {
                taggedUsers : {
                    some : {
                        id : userId
                    }
                }
            }
        });
    },

    async deletePost(id : number){
        return await prisma.post.delete({
            where : {
                id
            }
        });
    }
}