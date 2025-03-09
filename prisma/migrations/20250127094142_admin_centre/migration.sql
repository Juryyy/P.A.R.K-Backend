-- CreateEnum
CREATE TYPE "AdminCenterEnum" AS ENUM ('Brno', 'Prague');

-- AlterTable
ALTER TABLE "DateLock" ADD COLUMN     "adminCenter" "AdminCenterEnum" NOT NULL DEFAULT 'Brno';

-- AlterTable
ALTER TABLE "DayOfExams" ADD COLUMN     "adminCenter" "AdminCenterEnum" NOT NULL DEFAULT 'Brno';

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "adminCenter" "AdminCenterEnum" NOT NULL DEFAULT 'Brno';

-- AlterTable
ALTER TABLE "ExamLocation" ADD COLUMN     "adminCenter" "AdminCenterEnum"[] DEFAULT ARRAY['Brno']::"AdminCenterEnum"[];

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "adminCenter" "AdminCenterEnum"[] DEFAULT ARRAY['Brno']::"AdminCenterEnum"[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "adminCenter" "AdminCenterEnum"[] DEFAULT ARRAY['Brno']::"AdminCenterEnum"[];
