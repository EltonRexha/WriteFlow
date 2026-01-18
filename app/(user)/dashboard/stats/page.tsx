import React from 'react';
import { Eye, MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react';
import SearchBlogStats from './_components/SearchBlogStats';
import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';

const page = async () => {
  const session = await getServerSession();
  const user = session?.user;

  if (!user?.email) {
    return <div>You need to be logged in to view stats</div>;
  }

  const statsPerBlog = await prisma.blog.findMany({
    where: {
      Author: {
        email: user.email,
      },
    },
    select: {
      _count: {
        select: {
          viewedBy: true,
          BlogComment: true,
          dislikedBy: true,
          likedBy: true,
        },
      },
    },
  });

  const totalBlogStats = statsPerBlog.reduce(
    (prev, curr) => {
      return {
        _count: {
          BlogComment: prev._count.BlogComment + curr._count.BlogComment,
          dislikedBy: prev._count.dislikedBy + curr._count.dislikedBy,
          likedBy: prev._count.likedBy + curr._count.likedBy,
          viewedBy: prev._count.viewedBy + curr._count.viewedBy,
        },
      };
    },
    {
      _count: {
        likedBy: 0,
        dislikedBy: 0,
        BlogComment: 0,
        viewedBy: 0,
      },
    }
  );

  const statsPerComment = await prisma.blogComment.findMany({
    where: {
      Author: {
        email: user.email,
      },
    },
    select: {
      _count: {
        select: {
          dislikedBy: true,
          likedBy: true,
        },
      },
    },
  });

  const totalCommentStats = statsPerComment.reduce(
    (prev, curr) => {
      return {
        _count: {
          dislikedBy: prev._count.dislikedBy + curr._count.dislikedBy,
          likedBy: prev._count.likedBy + curr._count.likedBy,
        },
      };
    },
    {
      _count: {
        likedBy: 0,
        dislikedBy: 0,
      },
    }
  );

  return (
    <div className="">
      <div className="space-y-8 [&_.stat]:border-0 [&_.stat]:min-w-full [&_.stat]:max-w-min [&_.stat]:bg-base-200 [&_.stat]:hover:bg-base-300 [&_.stat]:rounded-md  ">
        <div>
          <h1 className="text-4xl text-base-content">Overall</h1>
          <div className="mt-5 space-y-2 ">
            <h1 className="text-2xl text-base-content/80">Blog stats</h1>
            <div className="grid overflow-auto sm:grid-cols-2 xl:grid-cols-4 m-auto xl:m-0 w-max gap-4 py-8">
              <div className="stat">
                <div className="stat-figure text-secondary ">
                  <Eye />
                </div>
                <div className="stat-title">Total Blog Views</div>
                <div className="stat-value text-secondary">
                  {totalBlogStats._count.viewedBy}
                </div>
              </div>
              <div className="stat ">
                <div className="stat-figure text-secondary">
                  <ThumbsUp />
                </div>
                <div className="stat-title">Total Blog Likes</div>
                <div className="stat-value text-secondary">
                  {totalBlogStats._count.likedBy}
                </div>
              </div>
              <div className="stat">
                <div className="stat-figure text-secondary ">
                  <ThumbsDown />
                </div>
                <div className="stat-title ">Total Blog Dislikes</div>
                <div className="stat-value text-secondary">
                  {totalBlogStats._count.dislikedBy}
                </div>
              </div>
              <div className="stat">
                <div className="stat-figure text-secondary ">
                  <MessageSquare />
                </div>
                <div className="stat-title ">Total Blog Comments</div>
                <div className="stat-value text-secondary">
                  {totalBlogStats._count.BlogComment}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-2xl text-base-content/80">Blog stats</h1>
          <div className="grid overflow-auto sm:grid-cols-2 xl:grid-cols-4 [&_.stat]:max-w-min m-auto xl:m-0 w-max gap-4 py-8">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <ThumbsUp />
              </div>
              <div className="stat-title">Total Comment Likes</div>
              <div className="stat-value text-secondary">
                {totalCommentStats._count.likedBy}
              </div>
            </div>
            <div className="stat">
              <div className="stat-figure text-secondary ">
                <ThumbsDown />
              </div>
              <div className="stat-title ">Total Comment Dislikes</div>
              <div className="stat-value text-secondary">
                {totalCommentStats._count.dislikedBy}
              </div>
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-4xl text-base-content">Specific</h1>
          <SearchBlogStats />
        </div>
      </div>
    </div>
  );
};

export default page;
