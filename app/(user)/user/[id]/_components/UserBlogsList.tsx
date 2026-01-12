'use client';
import React from 'react';
import { isActionError } from '@/types/ActionError';
import BlogPreviewCard from '../../../home/[topic]/_components/BlogPreviewCard';
import { getUserBlogs } from '@/libs/api/blog';
import { useInfiniteQuery } from '@tanstack/react-query';

// Re-using BlogSkeleton from BlogsByTopic
const BlogSkeleton = () => {
  return (
    <article className="flex gap-6 py-6 border-b border-base-content/10">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="skeleton w-6 h-6 rounded-full"></div>
          <div className="skeleton h-4 w-24 hidden sm:block "></div>
          <div className="skeleton h-4 w-16 hidden sm:block "></div>
        </div>

        <div className="space-y-2">
          <div className="skeleton h-7 w-3/4"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-2/3"></div>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <div className="skeleton h-5 w-12"></div>
          <div className="skeleton h-5 w-12"></div>
        </div>
      </div>

      <div className="skeleton w-28 h-28"></div>
    </article>
  );
};

interface Props {
  userEmail: string;
}

const UserBlogsList = ({ userEmail }: Props) => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['userBlogs', userEmail],
    queryFn: ({ pageParam }) => getUserBlogs(userEmail, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || isActionError(lastPage)) return undefined;
      if (!lastPage.pagination.hasNextPage) return undefined;
      return lastPage.pagination.currentPage + 1;
    },
    retry: false,
  });

  const blogs =
    data?.pages.flatMap((page) => (isActionError(page) ? [] : page.blogs)) ||
    [];

  if (isLoading && blogs.length === 0) {
    return (
      <div className="space-y-6">
        <BlogSkeleton />
        <BlogSkeleton />
        <BlogSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2">
      <div className="space-y-6">
        {blogs.map((blog) => (
          <BlogPreviewCard key={blog.id} {...blog} />
        ))}
        {(isLoading || blogs.length === 0) && (
          <>
            <BlogSkeleton />
            <BlogSkeleton />
          </>
        )}
      </div>
      {hasNextPage && (
        <div className="flex justify-center">
          <button
            className="btn btn-secondary btn-dash btn-sm w-max"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <span className="loading loading-spinner"></span>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserBlogsList;
