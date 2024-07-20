import { Response, Request } from "express";
import { URequest } from "../types/URequest";
import postService from "../services/post-service";
import PostSchema from "../helpers/Schemas/post-schemas";
import { Post, RoleEnum } from "@prisma/client";
import userService from "../services/user-service";
import logger from "../configs/logger";

/*     await api.post('/posts/create', {
    title: post.title,
    content: post.content,
    roles: post.roles,
    links: post.links,
    users: post.users
    }); */

export default {
    createPost: async (req: URequest, res: Response) => {
        const post = req.body;
        try{
            PostSchema.parse(post);
        }catch(error: unknown){
            logger.error(error);
            return res.status(400).json({ error: 'Invalid data' });
        }

        const date = new Date();

        const newPost = {
            title: post.title,
            content: post.content,
            taggedRoles: post.roles,
            author: {
                connect: {
                    id: req.user?.id as number,
                },
            },
            createdAt: date,
            updatedAt: date,
            published: true
        }

        try{
            const newPost_x = await postService.createPost(newPost);

            await userService.tagUserToPost(newPost_x.id, req.user?.id as number);

            for (let link of post.driveLink){
                link.postId = newPost_x.id;
                await postService.createLink(link);
            }

            for (let user of post.users){
                await userService.tagUserToTaggedPost(newPost_x.id, user.value);
            }

            return res.status(201).json({ message: 'Post created' });
        }catch(error){
            logger.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    getPostsForUser: async (req: URequest, res: Response) => {
        try {
            const userId = req.user?.id as number;
            const userRoles = req.user?.role as RoleEnum[];
    
            if (!Array.isArray(userRoles)) {
                return res.status(400).json({ error: 'User roles must be an array' });
            }
    
            const userPosts = await postService.getPostsForUser(userId);
            const rolePosts = await postService.getPostsForRoles(userRoles);
    
            const allPosts = userPosts.concat(rolePosts.filter((rolePost) => !userPosts.some((userPost) => userPost.id === rolePost.id)));
    
            allPosts.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    
            return res.status(200).json(allPosts);
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
}