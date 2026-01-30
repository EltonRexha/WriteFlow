'use client';
import { isActionError } from '@/types/ActionError';
import { Eye, MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react';
import React from 'react';
import { useBlogStats } from '@/hooks/queries/stats';

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
  } = useBlogStats({ blogId: blogId as string });

  if (!blogId || isLoading || !stats) {
    return null;
  }

  if (isError || isActionError(stats)) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-xl p-6 text-center">
        <h2 className="text-xl font-semibold text-error">Something went wrong</h2>
        <p className="text-error/70 mt-2">Unable to fetch blog statistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-base-100 rounded-xl border border-base-300 p-6">
        <h3 className="text-xl font-semibold text-base-content mb-6 flex items-center gap-2">
          <div className="w-2 h-8 bg-primary rounded-full"></div>
          {title}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Eye className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Views</span>
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {stats._count.viewedBy.toLocaleString()}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500 rounded-lg">
                <ThumbsUp className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Likes</span>
            </div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {stats._count.likedBy.toLocaleString()}
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-500 rounded-lg">
                <ThumbsDown className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-red-700 dark:text-red-300">Dislikes</span>
            </div>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              {stats._count.dislikedBy.toLocaleString()}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500 rounded-lg">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Comments</span>
            </div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {stats._count.BlogComment.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogStatsComponent;
