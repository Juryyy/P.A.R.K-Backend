import { Post, PrismaClient, Prisma, User, DriveLink, RoleEnum} from "@prisma/client";

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
            },
            include: {
                driveLink: true
            }
        });
    },

    async getPostsForRole(role : RoleEnum){
        return await prisma.post.findMany({
            where : {
                taggedRoles : {
                    has : role
                }
            },
            include: {
                driveLink: true
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

    async createLink(data : Prisma.DriveLinkCreateInput){
        return await prisma.driveLink.create({
            data
        });
    }
}