-- CreateTable
CREATE TABLE "_ExamToFile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ExamToFile_AB_unique" ON "_ExamToFile"("A", "B");

-- CreateIndex
CREATE INDEX "_ExamToFile_B_index" ON "_ExamToFile"("B");

-- AddForeignKey
ALTER TABLE "_ExamToFile" ADD CONSTRAINT "_ExamToFile_A_fkey" FOREIGN KEY ("A") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExamToFile" ADD CONSTRAINT "_ExamToFile_B_fkey" FOREIGN KEY ("B") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
