/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `DayOfExams` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DayOfExams_date_key" ON "DayOfExams"("date");
