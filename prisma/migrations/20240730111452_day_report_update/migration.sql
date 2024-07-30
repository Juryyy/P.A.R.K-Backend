/*
  Warnings:

  - You are about to drop the column `dayReportId` on the `Exam` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[examId]` on the table `DayReport` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `examId` to the `DayReport` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_dayReportId_fkey";

-- DropIndex
DROP INDEX "Exam_dayReportId_key";

-- AlterTable
ALTER TABLE "DayReport" ADD COLUMN     "examId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "dayReportId";

-- CreateIndex
CREATE UNIQUE INDEX "DayReport_examId_key" ON "DayReport"("examId");

-- AddForeignKey
ALTER TABLE "DayReport" ADD CONSTRAINT "DayReport_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
