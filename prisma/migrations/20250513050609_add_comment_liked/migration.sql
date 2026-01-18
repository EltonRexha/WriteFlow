-- CreateTable
CREATE TABLE "_likedComment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_likedComment_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_dislikedComment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_dislikedComment_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_likedComment_B_index" ON "_likedComment"("B");

-- CreateIndex
CREATE INDEX "_dislikedComment_B_index" ON "_dislikedComment"("B");

-- AddForeignKey
ALTER TABLE "_likedComment" ADD CONSTRAINT "_likedComment_A_fkey" FOREIGN KEY ("A") REFERENCES "blog_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likedComment" ADD CONSTRAINT "_likedComment_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dislikedComment" ADD CONSTRAINT "_dislikedComment_A_fkey" FOREIGN KEY ("A") REFERENCES "blog_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dislikedComment" ADD CONSTRAINT "_dislikedComment_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
