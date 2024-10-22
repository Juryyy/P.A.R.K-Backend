/*
  Warnings:

  - You are about to drop the column `pdfUrl` on the `Exam` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "pdfUrl",
ADD COLUMN     "scheduleUrl" TEXT;
