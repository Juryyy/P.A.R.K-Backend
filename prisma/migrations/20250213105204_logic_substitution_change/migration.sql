/*
  Warnings:

  - The values [Accepted,Rejected] on the enum `SubstitutionStatusEnum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isDone` on the `SubstitutionRequest` table. All the data in the column will be lost.
  - You are about to drop the `_SubstitutionApplicants` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[acceptedApplicationId]` on the table `SubstitutionRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ApplicationStatusEnum" AS ENUM ('Pending', 'Accepted', 'Rejected');

-- AlterEnum
BEGIN;
CREATE TYPE "SubstitutionStatusEnum_new" AS ENUM ('Open', 'Assigned', 'Closed');
ALTER TABLE "SubstitutionRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "SubstitutionRequest" ALTER COLUMN "status" TYPE "SubstitutionStatusEnum_new" USING ("status"::text::"SubstitutionStatusEnum_new");
ALTER TYPE "SubstitutionStatusEnum" RENAME TO "SubstitutionStatusEnum_old";
ALTER TYPE "SubstitutionStatusEnum_new" RENAME TO "SubstitutionStatusEnum";
DROP TYPE "SubstitutionStatusEnum_old";
ALTER TABLE "SubstitutionRequest" ALTER COLUMN "status" SET DEFAULT 'Open';
COMMIT;

-- DropForeignKey
ALTER TABLE "_SubstitutionApplicants" DROP CONSTRAINT "_SubstitutionApplicants_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubstitutionApplicants" DROP CONSTRAINT "_SubstitutionApplicants_B_fkey";

-- AlterTable
ALTER TABLE "SubstitutionRequest" DROP COLUMN "isDone",
ADD COLUMN     "acceptedApplicationId" INTEGER;

-- DropTable
DROP TABLE "_SubstitutionApplicants";

-- CreateTable
CREATE TABLE "SubstitutionApplication" (
    "id" SERIAL NOT NULL,
    "substitutionId" INTEGER NOT NULL,
    "applicantId" INTEGER NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ApplicationStatusEnum" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "SubstitutionApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubstitutionApplication_substitutionId_applicantId_key" ON "SubstitutionApplication"("substitutionId", "applicantId");

-- CreateIndex
CREATE UNIQUE INDEX "SubstitutionRequest_acceptedApplicationId_key" ON "SubstitutionRequest"("acceptedApplicationId");

-- AddForeignKey
ALTER TABLE "SubstitutionRequest" ADD CONSTRAINT "SubstitutionRequest_acceptedApplicationId_fkey" FOREIGN KEY ("acceptedApplicationId") REFERENCES "SubstitutionApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubstitutionApplication" ADD CONSTRAINT "SubstitutionApplication_substitutionId_fkey" FOREIGN KEY ("substitutionId") REFERENCES "SubstitutionRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubstitutionApplication" ADD CONSTRAINT "SubstitutionApplication_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
