-- CreateTable
CREATE TABLE "ImportedCandidate" (
    "id" SERIAL NOT NULL,
    "Level" "LevelEnum" NOT NULL,
    "DateOfExam" TIMESTAMP(3) NOT NULL,
    "Location" TEXT NOT NULL,
    "Venue" TEXT,
    "CandidateId" INTEGER,
    "TypeOfExam" "TypeOfExamEnum" NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "BirthDate" TIMESTAMP(3) NOT NULL,
    "Email" TEXT NOT NULL,
    "Phone" TEXT NOT NULL,
    "Code" TEXT NOT NULL,
    "Partner" TEXT,
    "Mock" BOOLEAN NOT NULL DEFAULT false,
    "Paid" BOOLEAN NOT NULL DEFAULT false,
    "OrderId" INTEGER,
    "Requirements" TEXT,
    "CrfToSchool" BOOLEAN NOT NULL DEFAULT false,
    "Note" TEXT,

    CONSTRAINT "ImportedCandidate_pkey" PRIMARY KEY ("id")
);
