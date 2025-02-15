/*
  Warnings:

  - Made the column `reason` on table `SubstitutionRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SubstitutionRequest" ADD COLUMN     "isDone" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "reason" SET NOT NULL;
