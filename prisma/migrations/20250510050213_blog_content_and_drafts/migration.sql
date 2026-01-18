-- CreateTable
CREATE TABLE "blog_content" (
    "id" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draft" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "blog_content_id" TEXT NOT NULL,

    CONSTRAINT "draft_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "draft" ADD CONSTRAINT "draft_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "draft" ADD CONSTRAINT "draft_blog_content_id_fkey" FOREIGN KEY ("blog_content_id") REFERENCES "blog_content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
