/*
  Warnings:

  - Changed the column `role` on the `User` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- AlterTable
ALTER TABLE "User"
ALTER COLUMN "role" TYPE "RoleEnum"[]
USING ARRAY["role"]::"RoleEnum"[];
