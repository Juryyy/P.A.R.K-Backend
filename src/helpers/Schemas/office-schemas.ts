import { z } from 'zod';
import { RoleEnum } from '@prisma/client';

const Roles = z.enum(Object.values(RoleEnum) as [string, ...string[]]);

const RegisterSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: Roles,
});

export default RegisterSchema ;
