/*
  Warnings:

  - A unique constraint covering the columns `[firstName,lastName,birthDate,dateOfExam,location,typeOfExam,level]` on the table `ImportedCandidate` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ImportedCandidate_firstName_lastName_birthDate_dateOfExam_l_key";

-- AlterTable
ALTER TABLE "DayOfExams" ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ExamVenue" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "ImportedCandidate_firstName_lastName_birthDate_dateOfExam_l_key" ON "ImportedCandidate"("firstName", "lastName", "birthDate", "dateOfExam", "location", "typeOfExam", "level");
