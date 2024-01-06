/*
  Warnings:

  - Added the required column `dayOfExamsId` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "dayOfExamsId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_dayOfExamsId_fkey" FOREIGN KEY ("dayOfExamsId") REFERENCES "DayOfExams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
