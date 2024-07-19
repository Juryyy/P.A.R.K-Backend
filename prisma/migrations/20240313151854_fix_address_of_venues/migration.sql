/*
  Warnings:

  - You are about to drop the column `latitude` on the `ExamVenue` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `ExamVenue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExamVenue" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "gLink" TEXT NOT NULL DEFAULT 'https://www.google.com/maps';
