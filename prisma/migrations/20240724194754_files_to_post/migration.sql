/*
  Warnings:

  - Added the required column `PostId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "PostId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_PostId_fkey" FOREIGN KEY ("PostId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
