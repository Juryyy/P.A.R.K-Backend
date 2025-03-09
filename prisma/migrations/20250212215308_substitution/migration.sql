-- CreateEnum
CREATE TYPE "SubstitutionStatusEnum" AS ENUM ('Open', 'Accepted', 'Rejected');

-- CreateTable
CREATE TABLE "SubstitutionRequest" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "requestedById" INTEGER NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "status" "SubstitutionStatusEnum" NOT NULL DEFAULT 'Open',
    "substitutorId" INTEGER,
    "originalRole" "RoleEnum" NOT NULL,
    "adminCentre" "AdminCentreEnum" NOT NULL DEFAULT 'Brno',

    CONSTRAINT "SubstitutionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SubstitutionApplicants" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SubstitutionRequest_examId_requestedById_originalRole_key" ON "SubstitutionRequest"("examId", "requestedById", "originalRole");

-- CreateIndex
CREATE UNIQUE INDEX "_SubstitutionApplicants_AB_unique" ON "_SubstitutionApplicants"("A", "B");

-- CreateIndex
CREATE INDEX "_SubstitutionApplicants_B_index" ON "_SubstitutionApplicants"("B");

-- AddForeignKey
ALTER TABLE "SubstitutionRequest" ADD CONSTRAINT "SubstitutionRequest_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubstitutionRequest" ADD CONSTRAINT "SubstitutionRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubstitutionRequest" ADD CONSTRAINT "SubstitutionRequest_substitutorId_fkey" FOREIGN KEY ("substitutorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubstitutionApplicants" ADD CONSTRAINT "_SubstitutionApplicants_A_fkey" FOREIGN KEY ("A") REFERENCES "SubstitutionRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubstitutionApplicants" ADD CONSTRAINT "_SubstitutionApplicants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
