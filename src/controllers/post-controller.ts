import { Response } from "express";
import { URequest } from "../types/URequest";
import postService from "../services/post-service";
import PostSchema from "../helpers/Schemas/post-schemas";
import { RoleEnum } from "@prisma/client";
import userService from "../services/user-service";
import logger from "../configs/logger";
import { User } from "@prisma/client";
import { uploadPostToOnedrive, deletePostFile } from "../middlewares/admin/upload-middleware";
import fs from "fs";
import path from "path";
import mime from "mime-types";

export default {
    createPost: async (req: URequest, res: Response) => {
        let { title, content, roles, users } = req.body;

        try {
            roles = JSON.parse(roles);
            users = JSON.parse(users);
        } catch (error) {
            logger.error("Failed to parse roles or users", error);
            return res.status(400).json({ error: "Invalid roles or users format" });
        }
    
        try {
            PostSchema.parse({ title, content, roles, users });
        } catch (error: any) {
            logger.error(error);
            return res.status(400).json({ error: error.errors[0].message });
        }

        const date = new Date();

        const postRequest = {
            title,
            content,
            taggedRoles: roles,
            author: {
                connect: {
                    id: req.user?.id as number,
                },
            },
            createdAt: date,
            updatedAt: date,
            published: true
        };

        try {
            const newPost = await postService.createPost(postRequest);
        
            await userService.tagUserToPost(newPost.id, req.user?.id as number);
        
            for (let user of users) {
                await userService.tagUserToTaggedPost(newPost.id, user.value);
            }
        
            if (req.files) {
                const files = req.files as Express.Multer.File[];
            
                for (const file of files) {
                    await uploadPostToOnedrive(file, newPost.id, req.user as User);
                }
            }
        
            return res.status(201).json({ message: 'Post created' });
        } catch (error) {
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
            
            allPosts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
            // Read and include avatar data
            const postsWithAvatars = await Promise.all(allPosts.map(async (post) => {
                let avatarData = null;
                if (post.author.avatarUrl) {
                    const imagePath = path.join(__dirname, `../../static/images/${post.author.avatarUrl}`);
                    try {
                        const fileData = await new Promise<Buffer>((resolve, reject) => {
                            fs.readFile(imagePath, (err, data) => {
                                if (err) reject(err);
                                else resolve(data);
                            });
                        });
                        const base64Data = fileData.toString('base64');
                        const mimeType = mime.lookup(post.author.avatarUrl) || 'application/octet-stream';
                        avatarData = `data:${mimeType};base64,${base64Data}`;
                    } catch (error) {
                        console.error(`Error reading avatar for user ${post.author.id}:`, error);
                    }
                }
    
                return {
                    ...post,
                    author: {
                        ...post.author,
                        avatarData
                    }
                };
            }));
    
                        
            return res.status(200).json(postsWithAvatars);
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    deletePost: async (req: URequest, res: Response) => {
        const postId = parseInt(req.params.id);
    
        try {
            const post = await postService.getPostById(postId);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            if (post.files.length > 0) {
                for (const file of post.files) {
                    try{
                        await deletePostFile(file.id);
                    }catch(err){
                        logger.error(err);
                        return res.status(500).json({ error: 'Error deleting file' });
                    }
                }
            }

            await postService.deletePost(postId);
            return res.status(200).json({ message: 'Post deleted' });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    
}


async function getUserAvatarById(userId: number): Promise<string | null> {
    const user = await userService.getUserById(userId);
    if (!user || !user.avatarUrl) return null;

    const imagePath = path.join(__dirname, `../../static/images/${user.avatarUrl}`);
    return fs.existsSync(imagePath) ? `/api/users/${userId}/avatar` : null;
}