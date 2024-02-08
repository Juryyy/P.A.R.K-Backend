/*
  Warnings:

  - You are about to drop the column `response` on the `DayOfExams` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `DayOfExams` table. All the data in the column will be lost.
  - The `levels` column on the `Exam` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `Exam` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('Office', 'Supervisor', 'SeniorSupervisor', 'Invigilator', 'SeniorInvigilator', 'Tech', 'Examiner');

-- CreateEnum
CREATE TYPE "TypeOfExamEnum" AS ENUM ('Mock', 'Paper', 'Computer', 'Speaking');

-- CreateEnum
CREATE TYPE "ResponseEnum" AS ENUM ('Yes', 'No', 'Maybe');

-- CreateEnum
CREATE TYPE "LevelEnum" AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');

-- DropForeignKey
ALTER TABLE "DayOfExams" DROP CONSTRAINT "DayOfExams_userId_fkey";

-- AlterTable
ALTER TABLE "DayOfExams" DROP COLUMN "response",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "type",
ADD COLUMN     "type" "TypeOfExamEnum" NOT NULL,
DROP COLUMN "levels",
ADD COLUMN     "levels" "LevelEnum"[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "RoleEnum" NOT NULL;

-- DropEnum
DROP TYPE "Level";

-- DropEnum
DROP TYPE "Response";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "TypeOfExam";

-- CreateTable
CREATE TABLE "Response" (
    "id" SERIAL NOT NULL,
    "dayOfExamsId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "response" "ResponseEnum" NOT NULL DEFAULT 'No',

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_dayOfExamsId_fkey" FOREIGN KEY ("dayOfExamsId") REFERENCES "DayOfExams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
