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
// make at least one role or one user required
const PostSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  content: z.string().min(1),
  createdAt: z.instanceof(Date).optional(),
  updatedAt: z.instanceof(Date).optional(),
  roles: Roles.optional(),
  users: z.array(UserSchema).optional(),
}).refine(data => data.roles && data.roles.length > 0 || data.users && data.users.length > 0, {
  message: "At least one role or one user is required",
  path: ["roles", "users"], // This will set the error on either roles or users
});

export default PostSchema;