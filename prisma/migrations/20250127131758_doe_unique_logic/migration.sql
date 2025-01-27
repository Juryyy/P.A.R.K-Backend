/*
  Warnings:

  - A unique constraint covering the columns `[date,adminCentre]` on the table `DayOfExams` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "DayOfExams_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "DayOfExams_date_adminCentre_key" ON "DayOfExams"("date", "adminCentre");
