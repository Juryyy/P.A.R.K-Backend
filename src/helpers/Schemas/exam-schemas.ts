import { z } from 'zod';
import { TypeOfExamEnum, LevelEnum } from '@prisma/client';

const levels = z.enum(Object.values(LevelEnum) as [string, ...string[]]);
const types = z.enum(Object.values(TypeOfExamEnum) as [string, ...string[]]);

const examInfoSchema = z.object({
    venue: z.string().min(1),
    type: types,
    levels: z.array(levels),
    startTime: z.string(),
    endTime: z.string(),
    note: z.string().optional(),
    dayOfExamsId: z.number(),
    });

const examDayReportSchema = z.object({
    examId: z.number(),
    comment: z.string(),
    issues: z.string(),
});


export default {examInfoSchema, examDayReportSchema};

