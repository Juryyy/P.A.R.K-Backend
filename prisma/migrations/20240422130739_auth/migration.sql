-- CreateTable
CREATE TABLE "Authorization" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Authorization_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Authorization" ADD CONSTRAINT "Authorization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
