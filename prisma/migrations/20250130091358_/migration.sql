/*
  Warnings:

  - The values [Prague] on the enum `AdminCentreEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AdminCentreEnum_new" AS ENUM ('Brno', 'Praha');
ALTER TABLE "DateLock" ALTER COLUMN "adminCentre" DROP DEFAULT;
ALTER TABLE "DayOfExams" ALTER COLUMN "adminCentre" DROP DEFAULT;
ALTER TABLE "Exam" ALTER COLUMN "adminCentre" DROP DEFAULT;
ALTER TABLE "ExamLocation" ALTER COLUMN "adminCentre" DROP DEFAULT;
ALTER TABLE "Post" ALTER COLUMN "adminCentre" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "adminCentre" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "adminCentre" TYPE "AdminCentreEnum_new"[] USING ("adminCentre"::text::"AdminCentreEnum_new"[]);
ALTER TABLE "DayOfExams" ALTER COLUMN "adminCentre" TYPE "AdminCentreEnum_new" USING ("adminCentre"::text::"AdminCentreEnum_new");
ALTER TABLE "Exam" ALTER COLUMN "adminCentre" TYPE "AdminCentreEnum_new" USING ("adminCentre"::text::"AdminCentreEnum_new");
ALTER TABLE "ExamLocation" ALTER COLUMN "adminCentre" TYPE "AdminCentreEnum_new"[] USING ("adminCentre"::text::"AdminCentreEnum_new"[]);
ALTER TABLE "Post" ALTER COLUMN "adminCentre" TYPE "AdminCentreEnum_new"[] USING ("adminCentre"::text::"AdminCentreEnum_new"[]);
ALTER TABLE "DateLock" ALTER COLUMN "adminCentre" TYPE "AdminCentreEnum_new" USING ("adminCentre"::text::"AdminCentreEnum_new");
ALTER TYPE "AdminCentreEnum" RENAME TO "AdminCentreEnum_old";
ALTER TYPE "AdminCentreEnum_new" RENAME TO "AdminCentreEnum";
DROP TYPE "AdminCentreEnum_old";
ALTER TABLE "DateLock" ALTER COLUMN "adminCentre" SET DEFAULT 'Brno';
ALTER TABLE "DayOfExams" ALTER COLUMN "adminCentre" SET DEFAULT 'Brno';
ALTER TABLE "Exam" ALTER COLUMN "adminCentre" SET DEFAULT 'Brno';
ALTER TABLE "ExamLocation" ALTER COLUMN "adminCentre" SET DEFAULT ARRAY['Brno']::"AdminCentreEnum"[];
ALTER TABLE "Post" ALTER COLUMN "adminCentre" SET DEFAULT ARRAY['Brno']::"AdminCentreEnum"[];
ALTER TABLE "User" ALTER COLUMN "adminCentre" SET DEFAULT ARRAY['Brno']::"AdminCentreEnum"[];
COMMIT;
