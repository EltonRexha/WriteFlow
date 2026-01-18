-- CreateTable
CREATE TABLE "_viewed" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_viewed_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_viewed_B_index" ON "_viewed"("B");

-- AddForeignKey
ALTER TABLE "_viewed" ADD CONSTRAINT "_viewed_A_fkey" FOREIGN KEY ("A") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_viewed" ADD CONSTRAINT "_viewed_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
