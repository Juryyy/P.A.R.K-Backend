-- AlterEnum
ALTER TYPE "TypeOfExamEnum" ADD VALUE 'NonSpeaking';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatarUrl" SET DEFAULT 'testMan.jpg';
