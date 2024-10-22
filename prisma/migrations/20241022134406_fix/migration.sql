/*
  Warnings:

  - You are about to drop the column `scheduleUrl` on the `Exam` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "scheduleUrl",
ADD COLUMN     "pdfUrl" TEXT,
ADD COLUMN     "schedule" TEXT;
