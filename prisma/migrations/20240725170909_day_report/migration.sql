/*
  Warnings:

  - You are about to drop the column `venue` on the `Exam` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dayReportId]` on the table `Exam` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `venueid` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "venue",
ADD COLUMN     "dayReportId" INTEGER,
ADD COLUMN     "venueid" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "DayReport" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "DayReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exam_dayReportId_key" ON "Exam"("dayReportId");

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_venueid_fkey" FOREIGN KEY ("venueid") REFERENCES "ExamVenue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_dayReportId_fkey" FOREIGN KEY ("dayReportId") REFERENCES "DayReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DayReport" ADD CONSTRAINT "DayReport_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
