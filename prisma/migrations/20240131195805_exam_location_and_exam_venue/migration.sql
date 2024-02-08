-- CreateTable
CREATE TABLE "ExamLocation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ExamLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamVenue" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "ExamVenue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExamVenue" ADD CONSTRAINT "ExamVenue_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "ExamLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
