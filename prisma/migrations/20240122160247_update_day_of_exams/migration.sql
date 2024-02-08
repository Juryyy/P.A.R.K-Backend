-- AlterTable
ALTER TABLE "DayOfExams" ADD COLUMN     "isForExaminers" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isForInvigilators" BOOLEAN NOT NULL DEFAULT true;
