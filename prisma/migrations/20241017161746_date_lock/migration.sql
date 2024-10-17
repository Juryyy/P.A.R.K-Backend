-- CreateTable
CREATE TABLE "DateLock" (
    "id" SERIAL NOT NULL,
    "when" TIMESTAMP(3) NOT NULL,
    "first" TIMESTAMP(3) NOT NULL,
    "last" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DateLock_pkey" PRIMARY KEY ("id")
);
