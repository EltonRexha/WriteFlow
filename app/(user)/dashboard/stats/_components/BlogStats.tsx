'use client';
import { isActionError } from '@/types/ActionError';
import clsx from 'clsx';
import { Eye, MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Limelight } from 'next/font/google';
import React from 'react';
import { getBlogStats } from '@/libs/api/stats';
import { useQuery } from '@tanstack/react-query';

const limeLight = Limelight({
  weight: '400',
});

interface BlogStatsData {
  _count: {
    likedBy: number;
    dislikedBy: number;
    BlogComment: number;
    viewedBy: number;
  };
}

const BlogStatsComponent = ({
  blogId,
  title,
}: {
  blogId: string | null;
  title: string;
}) => {
  const {
    data: stats,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['stats', 'blog', blogId],
    queryFn: () => getBlogStats(blogId as string),
    enabled: !!blogId,
    retry: false,
  });

  if (!blogId || isLoading || !stats) {
    return null;
  }

  if (isError || isActionError(stats)) {
    return (
      <h1 className="text-3xl m-auto my-4">
        Something wrong happened fetching stats
      </h1>
    );
  }

  return (
    <div className="space-y-8 [&_.stat]:border-0 [&_.stat]:min-w-full [&_.stat]:max-w-min [&_.stat]:bg-base-200 [&_.stat]:hover:bg-base-300 [&_.stat]:rounded-md  ">
      <div>
        <h1 className={clsx('text-2xl text-base-content', limeLight.className)}>
          {title}
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
                {stats._count.viewedBy}
              </div>
            </div>
            <div className="stat ">
              <div className="stat-figure text-secondary">
                <ThumbsUp />
              </div>
              <div className="stat-title">Total Blog Likes</div>
              <div className="stat-value text-secondary">
                {stats._count.likedBy}
              </div>
            </div>
            <div className="stat">
              <div className="stat-figure text-secondary ">
                <ThumbsDown />
              </div>
              <div className="stat-title ">Total Blog Dislikes</div>
              <div className="stat-value text-secondary">
                {stats._count.dislikedBy}
              </div>
            </div>
            <div className="stat">
              <div className="stat-figure text-secondary ">
                <MessageSquare />
              </div>
              <div className="stat-title ">Total Blog Comments</div>
              <div className="stat-value text-secondary">
                {stats._count.BlogComment}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogStatsComponent;
