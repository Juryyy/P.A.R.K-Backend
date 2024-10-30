import { date, z } from 'zod';
import { RoleEnum, LevelEnum } from '@prisma/client';


const levels = z.array(z.enum(Object.values(LevelEnum) as [string, ...string[]]));
const roles = z.array(z.enum(Object.values(RoleEnum) as [string, ...string[]]));

const userInfoSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().or(z.null()),
    note: z.string().or(z.null()),
    noteLonger: z.string().or(z.null()),
    drivingLicense: z.boolean(),
    parsedDateOfBirth: z.date().optional(),
    totaraDate: z.string().or(z.undefined()),
    totaraDone: z.boolean(),
    insperaAccount: z.boolean(),
});

const userActivationSchema = z.object({
    phone : z.string(),
    email: z.string().email(),
    dateOfBirth: z.date(),
    totaraDate: z.date(),
    totaraDone: z.boolean(),
    passwordUpdated: z.boolean(),
});

export { userInfoSchema, userActivationSchema};