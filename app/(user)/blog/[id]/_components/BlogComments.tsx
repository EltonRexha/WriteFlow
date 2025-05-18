'use client';
import React, { useCallback, useEffect, useState } from 'react';
import CreateBlogComment from './CreateBlogComment';
import BlogComment from './BlogComment';
import { getComments, getUserComments } from '@/server-actions/comments/action';
import { useToast } from '@/app/components/ToastProvider';

type CommentsFn = Awaited<ReturnType<typeof getComments>>;

const BlogComments = ({
  blogId,
  renderId,
}: {
  blogId: string;
  renderId: string;
}) => {
  const [blogComments, setBlogComments] = useState<CommentsFn>();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  const getBlogComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const newBlogComments = await getComments(blogId, page);
      if (page === 1) {
        const userComments = await getUserComments(blogId);
        setBlogComments(() => {
          if (!userComments.comments) return newBlogComments;
          return {
            comments: [...userComments.comments, ...newBlogComments.comments],
            pagination: newBlogComments.pagination,
          };
        });
      } else {
        setBlogComments((prev) => {
          if (!prev) return newBlogComments;
          return {
            comments: [...prev?.comments, ...newBlogComments.comments],
            pagination: newBlogComments.pagination,
          };
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      addToast('Error fetching comments:', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [blogId, page, addToast]);

  useEffect(() => {
    console.log('get comments');
    getBlogComments();
  }, [page, getBlogComments, renderId]);

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <>
      {blogComments && (
        <div
          id="commentSection"
          className="flex flex-col mt-10 space-y-5 mb-10"
        >
          <h2 className="text-2xl font-bold">Replies</h2>
          <CreateBlogComment blogId={blogId} />
          <div className="space-y-2">
            {blogComments.comments.map((data) => (
              <BlogComment key={data.id} {...data} />
            ))}
          </div>
          {blogComments.pagination.hasNextPage && (
            <button
              className="btn btn-secondary btn-dash btn-sm w-max self-center"
              onClick={() => setPage((prev) => prev + 1)}
            >
              {isLoading ? (
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
