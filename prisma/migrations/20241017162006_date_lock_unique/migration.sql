/*
  Warnings:

  - A unique constraint covering the columns `[when]` on the table `DateLock` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DateLock_when_key" ON "DateLock"("when");
