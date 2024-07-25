import {User, RoleEnum, Prisma, PrismaClient, ResponseEnum, DayOfExams, Exam, TypeOfExamEnum} from '@prisma/client';
import { UploadedFile } from 'express-fileupload';

export interface ExamWithVenueLink extends Exam {
    venueLink?: string;
  }

export interface FileArray {
    [fieldname: string]: UploadedFile | UploadedFile[];
}