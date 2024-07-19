/*
  Warnings:

  - You are about to drop the column `BirthDate` on the `ImportedCandidate` table. All the data in the column will be lost.
  - You are about to drop the column `CandidateId` on the `ImportedCandidate` table. All the data in the column will be lost.
  - You are about to drop the column `Code` on the `ImportedCandidate` table. All the data in the column will be lost.
  - You are about to drop the column `CrfToSchool` on the `ImportedCandidate` table. All the data in the column will be lost.
  - You are about to drop the column `DateOfExam` on the `ImportedCandidate` table. All the data in the column will be lost.
  - You are about to drop the column `Email` on the `ImportedCandidate` table. All the data in the column will be lost.
  - You are about to drop the column `FirstName` on the `ImportedCandidate` table. All the data in the column will be lost.
  - You are about to drop the column `LastName` on the `ImportedCandidate` table. All the data in the column will be lost.
  - You are about to drop the column `Level` on the `ImportedCandidate` table. All the data in the column will be lost.
  - You are about to drop the column `Location` on the `ImportedCandidate` table. All the data in the column will be lost.
  - You are about to drop the column `Mock` on the `ImportedCandidate` table. All the data in the column will be lost.
  - You are about to drop the column `Note` on the `ImportedCandidate` table. All the data in the column will be lost.
  - You are about to drop the column `OrderId` on the `ImportedCandidate` table. All the data in the column will be lost.
  - You are about to drop the column `Paid` on the `ImportedCandidate` table. All the data in the column will be lost.
  - You are about to drop the column `Partner` on the `ImportedCandidate` table. All the data in the column will be lost.
  - You are about to drop the column `Phone` on the `ImportedCandidate` table. All the data in the column will be lost.
  - You are about to drop the column `Requirements` on the `ImportedCandidate` table. All the data in the column will be lost.
  - You are about to drop the column `TypeOfExam` on the `ImportedCandidate` table. All the data in the column will be lost.
  - You are about to drop the column `Venue` on the `ImportedCandidate` table. All the data in the column will be lost.
  - Added the required column `birthDate` to the `ImportedCandidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `ImportedCandidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfExam` to the `ImportedCandidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `ImportedCandidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `ImportedCandidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `ImportedCandidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `ImportedCandidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `ImportedCandidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `ImportedCandidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeOfExam` to the `ImportedCandidate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ImportedCandidate" DROP COLUMN "BirthDate",
DROP COLUMN "CandidateId",
DROP COLUMN "Code",
DROP COLUMN "CrfToSchool",
DROP COLUMN "DateOfExam",
DROP COLUMN "Email",
DROP COLUMN "FirstName",
DROP COLUMN "LastName",
DROP COLUMN "Level",
DROP COLUMN "Location",
DROP COLUMN "Mock",
DROP COLUMN "Note",
DROP COLUMN "OrderId",
DROP COLUMN "Paid",
DROP COLUMN "Partner",
DROP COLUMN "Phone",
DROP COLUMN "Requirements",
DROP COLUMN "TypeOfExam",
DROP COLUMN "Venue",
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "candidateId" INTEGER,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "crfToSchool" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dateOfExam" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "level" "LevelEnum" NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "mock" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "orderId" INTEGER,
ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "partner" TEXT,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "typeOfExam" "TypeOfExamEnum" NOT NULL,
ADD COLUMN     "venue" TEXT;
