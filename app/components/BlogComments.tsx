'use client';
import React, { useEffect, useState } from 'react';
import CreateBlogComment from './CreateBlogComment';
import BlogComment from './ui/BlogComment';
import { getComments, getUserComments } from '@/server-actions/comments/action';

type CommentsFn = Awaited<ReturnType<typeof getComments>>;

const BlogComments = ({ blogId }: { blogId: string }) => {
  const [blogComments, setBlogComments] = useState<CommentsFn>();
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function getBlogComments() {
      const newBlogComments = await getComments(blogId, page);
      if (page === 1) {
        const userComments = await getUserComments(blogId);
        console.log(userComments);
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
    }

    getBlogComments();
  }, [page, blogId]);

  return (
    <>
      {blogComments && (
        <div
          id="commentSection"
          className="flex flex-col mt-10 space-y-5 mb-10"
        >
          <h2 className="text-2xl font-bold">
            Replies ({blogComments.comments.length})
          </h2>
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
              Load More
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default BlogComments;
