/*
  Warnings:

  - The values [SeniorSupervisor,SeniorInvigilator,Tech] on the enum `RoleEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoleEnum_new" AS ENUM ('Office', 'Supervisor', 'Invigilator', 'Technician', 'Examiner');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "RoleEnum_new"[] USING ("role"::text::"RoleEnum_new"[]);
ALTER TABLE "Post" ALTER COLUMN "taggedRoles" TYPE "RoleEnum_new"[] USING ("taggedRoles"::text::"RoleEnum_new"[]);
ALTER TYPE "RoleEnum" RENAME TO "RoleEnum_old";
ALTER TYPE "RoleEnum_new" RENAME TO "RoleEnum";
DROP TYPE "RoleEnum_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isSenior" BOOLEAN NOT NULL DEFAULT false;
