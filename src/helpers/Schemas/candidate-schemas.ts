import { z } from 'zod';
import { ImportedCandidate, Candidate, LevelEnum } from '@prisma/client';

const levels = z.enum(Object.values(LevelEnum) as [string, ...string[]]);

const importedCandidateSchema = z.object({
    level: levels,
    dateOfExam: z.coerce.date(),
    location: z.string(),
    venue: z.string().optional(),
    candidateId: z.number().optional().nullable(),
    firstName: z.string(),
    lastName: z.string(),
    birthDate: z.coerce.date(),
    email: z.string(),
    phone: z.string(),
    code: z.string().optional(),
    partner: z.string().optional(),
    mock: z.boolean(),
    paid: z.boolean(),
    orderId: z.number(),
    requirements: z.string().optional(),
    crfToSchool: z.boolean(),
    note: z.string().optional(),
});

export { importedCandidateSchema };
