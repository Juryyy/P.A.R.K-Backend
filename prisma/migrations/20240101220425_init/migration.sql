-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Office', 'Supervisor', 'SeniorSupervisor', 'Invigilator', 'SeniorInvigilator', 'Tech', 'Examiner');

-- CreateEnum
CREATE TYPE "TypeOfExam" AS ENUM ('Mock', 'Paper', 'Computer', 'Speaking');

-- CreateEnum
CREATE TYPE "Response" AS ENUM ('Yes', 'No', 'Maybe');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "drivingLicense" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "adminNote" TEXT,
    "role" "Role" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DayOfExams" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "response" "Response" NOT NULL DEFAULT 'No',

    CONSTRAINT "DayOfExams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" SERIAL NOT NULL,
    "venue" TEXT NOT NULL,
    "type" "TypeOfExam" NOT NULL,
    "levels" "Level"[],
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "note" TEXT,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "mockTest" BOOLEAN NOT NULL DEFAULT false,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "partnerId" INTEGER,
    "idForExam" INTEGER,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExamToSupervisor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ExamToInvigilator" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ExamToExaminer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CandidateToExam" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_partnerId_key" ON "Candidate"("partnerId");

-- CreateIndex
CREATE UNIQUE INDEX "_ExamToSupervisor_AB_unique" ON "_ExamToSupervisor"("A", "B");

-- CreateIndex
CREATE INDEX "_ExamToSupervisor_B_index" ON "_ExamToSupervisor"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExamToInvigilator_AB_unique" ON "_ExamToInvigilator"("A", "B");

-- CreateIndex
CREATE INDEX "_ExamToInvigilator_B_index" ON "_ExamToInvigilator"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExamToExaminer_AB_unique" ON "_ExamToExaminer"("A", "B");

-- CreateIndex
CREATE INDEX "_ExamToExaminer_B_index" ON "_ExamToExaminer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CandidateToExam_AB_unique" ON "_CandidateToExam"("A", "B");

-- CreateIndex
CREATE INDEX "_CandidateToExam_B_index" ON "_CandidateToExam"("B");

-- AddForeignKey
ALTER TABLE "DayOfExams" ADD CONSTRAINT "DayOfExams_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Candidate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExamToSupervisor" ADD CONSTRAINT "_ExamToSupervisor_A_fkey" FOREIGN KEY ("A") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExamToSupervisor" ADD CONSTRAINT "_ExamToSupervisor_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExamToInvigilator" ADD CONSTRAINT "_ExamToInvigilator_A_fkey" FOREIGN KEY ("A") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExamToInvigilator" ADD CONSTRAINT "_ExamToInvigilator_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExamToExaminer" ADD CONSTRAINT "_ExamToExaminer_A_fkey" FOREIGN KEY ("A") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExamToExaminer" ADD CONSTRAINT "_ExamToExaminer_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidateToExam" ADD CONSTRAINT "_CandidateToExam_A_fkey" FOREIGN KEY ("A") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidateToExam" ADD CONSTRAINT "_CandidateToExam_B_fkey" FOREIGN KEY ("B") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
