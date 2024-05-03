import {User, RoleEnum, Prisma, PrismaClient, ResponseEnum, DayOfExams, Exam, TypeOfExamEnum} from '@prisma/client';

export interface ExamWithVenueLink extends Exam {
    venueLink?: string;
  }