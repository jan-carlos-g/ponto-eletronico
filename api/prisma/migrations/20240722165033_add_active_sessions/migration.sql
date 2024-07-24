-- CreateTable
CREATE TABLE "ActiveSession" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ActiveSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActiveSession" ADD CONSTRAINT "ActiveSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
