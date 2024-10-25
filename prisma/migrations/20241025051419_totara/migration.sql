-- AlterTable
ALTER TABLE "User" ADD COLUMN     "totaraDate" TIMESTAMP(3),
ADD COLUMN     "totaraDone" BOOLEAN NOT NULL DEFAULT false;
