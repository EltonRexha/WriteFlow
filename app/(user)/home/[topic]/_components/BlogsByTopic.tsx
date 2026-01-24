'use client';
import React from 'react';
import BlogPreviewCard from './BlogPreviewCard';
import { isActionError } from '@/types/ActionError';
import recommendationApi from '@/libs/api/services/recommendation';
import { useInfiniteQuery } from '@tanstack/react-query';

const BlogSkeleton = () => {
  return (
    <article className="flex gap-6 py-6 border-b border-base-content/10">
      <div className="flex-1 min-w-0">
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

const BlogsByTopic = ({ topic }: { topic: string }) => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['recommendation', topic],
    queryFn: ({ pageParam }) => {
      const page = pageParam as number;
      if (topic.toLocaleLowerCase() === 'for-you') {
        return recommendationApi.getForYouBlogs(page);
      }

      if (topic.toLocaleLowerCase() === 'following') {
        return recommendationApi.getFollowingBlogs(page);
      }

      return recommendationApi.getBlogsByTopic(topic, page);
    },
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
    <div className="space-y-6">
      <div className="space-y-6">
        {blogs.length > 0 ? (
          blogs.map((data) => <BlogPreviewCard key={data.id} {...data} />)
        ) : (
          <h2 className="mx-auto w-max py-10 text-3xl font-semibold">
            Nothing to show
          </h2>
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
              'View More'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogsByTopic;
