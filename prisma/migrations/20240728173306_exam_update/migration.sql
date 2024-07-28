-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPrepared" BOOLEAN NOT NULL DEFAULT false;
