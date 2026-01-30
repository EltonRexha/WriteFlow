'use client';
import React, { useEffect } from 'react';
import CreateBlogComment from './CreateBlogComment';
import BlogComment from './BlogComment';
import { useToast } from '@/components/ToastProvider';
import useClientUser from '@/hooks/useClientUser';
import { useUserComments as useUserCommentsQuery, commentQueryKeys } from '@/hooks/queries/comments';
import commentApi from '@/libs/api/services/comments';
import { useInfiniteQuery } from '@tanstack/react-query';
import { isActionError } from '@/types/ActionError';

const BlogComments = ({
  blogId,
}: {
  blogId: string;
}) => {
  const { addToast } = useToast();
  const user = useClientUser();

  const { data: userComments } = useUserCommentsQuery({ blogId });

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: commentQueryKeys.list(blogId),
    queryFn: ({ pageParam }) => commentApi.getComments(blogId, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || isActionError(lastPage)) return undefined;
      if (!lastPage.pagination.hasNextPage) return undefined;
      return lastPage.pagination.currentPage + 1;
    },
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      addToast('Error fetching comments:', 'error');
    }
  }, [isError, addToast]);

  const otherComments =
    data?.pages.flatMap((page) =>
      isActionError(page) ? [] : page.comments
    ) || [];

  const mergedComments =
    user && userComments && !isActionError(userComments)
      ? [...(userComments.comments || []), ...otherComments]
      : otherComments;

  const pagination = (() => {
    const last = data?.pages?.[data.pages.length - 1];
    if (!last || isActionError(last)) return undefined;
    return last.pagination;
  })();

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <>
      {(!!user || !!mergedComments.length) && (
        <div
          id="commentSection"
          className="flex flex-col mt-10 space-y-5 mb-10 border-base-content/70 border-t-[1px] pt-10"
        >
          <h2 className="text-2xl font-bold">Replies</h2>
          {user && <CreateBlogComment blogId={blogId} />}
          <div className="space-y-2">
            {mergedComments.map((data) => (
              <BlogComment
                key={data.id}
                id={data.id}
                content={data.content}
                Author={data.Author}
                createdAt={data.createdAt}
                _count={data._count}
                isLiked={data.isLiked ?? false}
                isDisliked={data.isDisliked ?? false}
              />
            ))}
          </div>
          {!!pagination?.hasNextPage && hasNextPage && (
            <button
              className="btn btn-secondary btn-dash btn-sm w-max self-center"
              onClick={() => fetchNextPage()}
            >
              {isFetchingNextPage ? (
                <span className="loading loading-spinner"></span>
              ) : (
                'Load More'
              )}
            </button>
          )}
        </div>
      )}
    </>
  );
};

const Skeleton = () => {
  return (
    <div id="commentSection" className="flex flex-col mt-10 space-y-5 mb-10">
      {/* Title skeleton */}
      <div className="skeleton h-8 w-32"></div>

      {/* Create comment box skeleton */}
      <div className="skeleton h-32 w-full"></div>

      {/* Comments list skeleton */}
      <div className="space-y-2">
        {/* Generate 3 comment skeletons */}
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="flex space-x-4 p-4 bg-base-200 rounded-lg"
          >
            {/* Avatar skeleton */}
            <div className="skeleton w-12 h-12 rounded-full"></div>

            <div className="flex-1 space-y-2">
              {/* Author name skeleton */}
              <div className="skeleton h-4 w-32"></div>

              {/* Comment content skeleton */}
              <div className="space-y-2">
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-3/4"></div>
              </div>

              {/* Action buttons skeleton */}
              <div className="flex space-x-4 mt-2">
                <div className="skeleton h-8 w-20"></div>
                <div className="skeleton h-8 w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load more button skeleton */}
      <div className="skeleton h-8 w-24 self-center"></div>
    </div>
  );
};

export default BlogComments;
