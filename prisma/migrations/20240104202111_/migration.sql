/*
  Warnings:

  - You are about to drop the column `activeAccounts` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "activeAccounts",
ADD COLUMN     "activatedAccount" BOOLEAN NOT NULL DEFAULT false;
