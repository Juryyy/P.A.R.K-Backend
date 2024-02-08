/*
  Warnings:

  - A unique constraint covering the columns `[dayOfExamsId,userId]` on the table `Response` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Response_dayOfExamsId_userId_key" ON "Response"("dayOfExamsId", "userId");
