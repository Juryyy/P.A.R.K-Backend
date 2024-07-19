/*
  Warnings:

  - A unique constraint covering the columns `[firstName,lastName,birthDate,dateOfExam,location,typeOfExam]` on the table `ImportedCandidate` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ImportedCandidate" ALTER COLUMN "code" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ImportedCandidate_firstName_lastName_birthDate_dateOfExam_l_key" ON "ImportedCandidate"("firstName", "lastName", "birthDate", "dateOfExam", "location", "typeOfExam");
