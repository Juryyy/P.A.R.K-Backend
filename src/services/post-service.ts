import { Post, PrismaClient, Prisma, User, RoleEnum} from "@prisma/client";

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

    async getPostsForUser(userId: number) {
        return await prisma.post.findMany({
            where: {
                OR: [
                    { taggedUsers: { some: { id: userId } } },
                    { authorId: userId }
                ]
            },
            include: {
                files: true,
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
            },
        });
    },

    async getPostsForRoles(role : RoleEnum[]){
        return await prisma.post.findMany({
            where : {
                taggedRoles : {
                    hasSome : role
                }
            },
            include : {
                files : true,
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
            }
        });
    },

    async deletePost(id : number){
        return await prisma.post.delete({
            where : {
                id
            }
        });
    },

    async getPostById(id: number){
        return await prisma.post.findUnique({
            where : {
                id
            },
            include : {
                files : true,
                author : true
            }
        });
    },


}