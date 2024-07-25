/*
  Warnings:

  - You are about to drop the column `venueid` on the `Exam` table. All the data in the column will be lost.
  - Added the required column `venue` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_venueid_fkey";

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "venueid",
ADD COLUMN     "venue" TEXT NOT NULL;
