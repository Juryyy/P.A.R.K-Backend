/*
  Warnings:

  - The values [NonSpeaking] on the enum `TypeOfExamEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TypeOfExamEnum_new" AS ENUM ('Mock', 'Paper', 'Computer', 'Speaking', 'ComputerSpeaking', 'PaperSpeaking');
ALTER TABLE "Exam" ALTER COLUMN "type" TYPE "TypeOfExamEnum_new" USING ("type"::text::"TypeOfExamEnum_new");
ALTER TYPE "TypeOfExamEnum" RENAME TO "TypeOfExamEnum_old";
ALTER TYPE "TypeOfExamEnum_new" RENAME TO "TypeOfExamEnum";
DROP TYPE "TypeOfExamEnum_old";
COMMIT;

-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "ScheduleId" INTEGER;

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "ScheduleForDayId" INTEGER,
ADD COLUMN     "comments" TEXT,
ADD COLUMN     "issues" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deactivated" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "ScheduleForDayId" INTEGER,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleForDay" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduleForDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Break" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "ScheduleForDayId" INTEGER,

    CONSTRAINT "Break_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_ScheduleForDayId_fkey" FOREIGN KEY ("ScheduleForDayId") REFERENCES "ScheduleForDay"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_ScheduleId_fkey" FOREIGN KEY ("ScheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_ScheduleForDayId_fkey" FOREIGN KEY ("ScheduleForDayId") REFERENCES "ScheduleForDay"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Break" ADD CONSTRAINT "Break_ScheduleForDayId_fkey" FOREIGN KEY ("ScheduleForDayId") REFERENCES "ScheduleForDay"("id") ON DELETE SET NULL ON UPDATE CASCADE;
