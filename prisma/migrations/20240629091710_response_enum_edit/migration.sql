/*
  Warnings:

  - The values [Maybe] on the enum `ResponseEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ResponseEnum_new" AS ENUM ('Yes', 'No', 'AM', 'PM');
ALTER TABLE "Response" ALTER COLUMN "response" DROP DEFAULT;
ALTER TABLE "Response" ALTER COLUMN "response" TYPE "ResponseEnum_new" USING ("response"::text::"ResponseEnum_new");
ALTER TYPE "ResponseEnum" RENAME TO "ResponseEnum_old";
ALTER TYPE "ResponseEnum_new" RENAME TO "ResponseEnum";
DROP TYPE "ResponseEnum_old";
ALTER TABLE "Response" ALTER COLUMN "response" SET DEFAULT 'No';
COMMIT;
