/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ExamLocation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,locationId]` on the table `ExamVenue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ExamLocation_name_key" ON "ExamLocation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ExamVenue_name_locationId_key" ON "ExamVenue"("name", "locationId");
