/*
  Warnings:

  - You are about to drop the column `adminCenter` on the `DateLock` table. All the data in the column will be lost.
  - You are about to drop the column `adminCenter` on the `DayOfExams` table. All the data in the column will be lost.
  - You are about to drop the column `adminCenter` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `adminCenter` on the `ExamLocation` table. All the data in the column will be lost.
  - You are about to drop the column `adminCenter` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `adminCenter` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AdminCentreEnum" AS ENUM ('Brno', 'Prague');

-- AlterTable
ALTER TABLE "DateLock" DROP COLUMN "adminCenter",
ADD COLUMN     "adminCentre" "AdminCentreEnum" NOT NULL DEFAULT 'Brno';

-- AlterTable
ALTER TABLE "DayOfExams" DROP COLUMN "adminCenter",
ADD COLUMN     "adminCentre" "AdminCentreEnum" NOT NULL DEFAULT 'Brno';

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "adminCenter",
ADD COLUMN     "adminCentre" "AdminCentreEnum" NOT NULL DEFAULT 'Brno';

-- AlterTable
ALTER TABLE "ExamLocation" DROP COLUMN "adminCenter",
ADD COLUMN     "adminCentre" "AdminCentreEnum"[] DEFAULT ARRAY['Brno']::"AdminCentreEnum"[];

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "adminCenter",
ADD COLUMN     "adminCentre" "AdminCentreEnum"[] DEFAULT ARRAY['Brno']::"AdminCentreEnum"[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "adminCenter",
ADD COLUMN     "adminCentre" "AdminCentreEnum"[] DEFAULT ARRAY['Brno']::"AdminCentreEnum"[];

-- DropEnum
DROP TYPE "AdminCenterEnum";
