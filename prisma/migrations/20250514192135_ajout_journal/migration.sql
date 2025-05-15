-- CreateTable
CREATE TABLE "JournalPrivate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JournalPrivate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JournalPrivate_userId_date_key" ON "JournalPrivate"("userId", "date");

-- AddForeignKey
ALTER TABLE "JournalPrivate" ADD CONSTRAINT "JournalPrivate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
