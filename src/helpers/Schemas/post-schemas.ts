import { z } from 'zod';
import { RoleEnum } from '@prisma/client';

const Roles = z.array(z.enum(Object.values(RoleEnum) as [string, ...string[]]));

const UserSchema = z.object({
    label: z.string(),
    value: z.number(),
  });

const DriveLinkSchema = z.object({
    id: z.number().optional(),
    link: z.string().min(1),
    name: z.string().min(1),
    postId: z.number().optional(),
  });
  
const PostSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(1),
    content: z.string().min(1),
    createdAt: z.instanceof(Date).optional(),
    updatedAt: z.instanceof(Date).optional(),
    roles: Roles.optional(),
    users: z.array(UserSchema).optional(),
    driveLink: z.array(DriveLinkSchema).optional(),
  });

export default PostSchema;