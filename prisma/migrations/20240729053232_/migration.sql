/*
  Warnings:

  - Added the required column `venue` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exam" ADD COLUMN  "venue" TEXT NOT NULL;
