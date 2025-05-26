import React from 'react';
import MenuBar from '../_components/MenuBar';
import { Eye, MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Limelight } from 'next/font/google';
import clsx from 'clsx';
import SearchBlogStats from './_components/SearchBlogStats';
import {
  getTotalBlogsStats,
  getTotalCommentsStats,
} from '@/server-actions/stats/action';

const limeLight = Limelight({
  weight: '400',
});

const page = async () => {
  const totalBlogStats = await getTotalBlogsStats();
  const totalCommentStats = await getTotalCommentsStats();

  if ('error' in totalBlogStats || 'error' in totalCommentStats) {
    return <div>You need to be logged in to view stats</div>;
  }

  return (
    <div className="px-5 sm:px-12 lg:px-36 space-y-10">
      <MenuBar />
      <div className="space-y-8 [&_.stat]:border-0 [&_.stat]:min-w-full [&_.stat]:max-w-min [&_.stat]:bg-base-200 [&_.stat]:hover:bg-base-300 [&_.stat]:rounded-md  ">
        <div>
          <h1
            className={clsx('text-4xl text-base-content', limeLight.className)}
          >
            Overall
          </h1>
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
          <h1
            className={clsx('text-4xl text-base-content', limeLight.className)}
          >
            Specific
          </h1>
          <SearchBlogStats />
        </div>
      </div>
    </div>
  );
};

export default page;
