-- CreateTable
CREATE TABLE "ExamUserConfirmation" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" "RoleEnum" NOT NULL,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "ExamUserConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamUserConfirmation_examId_userId_role_key" ON "ExamUserConfirmation"("examId", "userId", "role");

-- AddForeignKey
ALTER TABLE "ExamUserConfirmation" ADD CONSTRAINT "ExamUserConfirmation_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamUserConfirmation" ADD CONSTRAINT "ExamUserConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
