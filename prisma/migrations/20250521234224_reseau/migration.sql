-- CreateTable
CREATE TABLE "ReseauEnergetique" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReseauEnergetique_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReseauEnergetique" ADD CONSTRAINT "ReseauEnergetique_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
