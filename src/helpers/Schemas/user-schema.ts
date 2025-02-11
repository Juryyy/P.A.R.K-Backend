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
    phone: z.string()
        .min(1, "Phone number is required")
        .regex(/\d+/, "Phone must contain only numbers"),
    email: z.string()
        .email("Invalid email format")
        .min(1, "Email is required"),
    //dateOfBirth: z.date()
    //    .refine(date => date instanceof Date && !isNaN(date.getTime()), 
    //        "Valid date of birth is required"),
    totaraDate: z.date()
        .refine(date => date instanceof Date && !isNaN(date.getTime()), 
            "Valid totara date is required"),
    totaraDone: z.boolean()
        .refine(val => val === true, "Totara must be completed"),
});

export { userInfoSchema, userActivationSchema};