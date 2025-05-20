'use client';
import {
  DisplayBlog,
  followingBlogs,
  forYouBlogs,
  getBlogsByTopic,
} from '@/server-actions/recommendation/action';
import React, { useEffect, useState } from 'react';
import BlogPreviewCard from './BlogPreviewCard';
import { isActionError } from '@/types/ActionError';

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

const BlogsByTopic = ({ topic }: { topic: string }) => {
  const [page, setPage] = useState(1);
  const [blogs, setBlogs] = useState<DisplayBlog[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // Initialize as true
  const [isChangingTopic, setIsChangingTopic] = useState(false);

  useEffect(() => {
    setIsChangingTopic(true); // Set topic change flag
    setIsLoading(true);
    setBlogs([]);
    setPage(1);
    setHasNextPage(true);
  }, [topic]);

  useEffect(() => {
    async function getBlogs() {
      let response;
      if (topic.toLocaleLowerCase() === 'for-you') {
        response = await forYouBlogs(page);
      } else if (topic.toLocaleLowerCase() === 'following') {
        response = await followingBlogs(page);
      } else {
        response = await getBlogsByTopic(topic, page);
      }

      if (isActionError(response)) {
        return;
      }

      if (page === 1) {
        setBlogs(response.blogs);
      } else {
        setBlogs((prev) => [...prev, ...response.blogs]);
      }
      setHasNextPage(response.pagination.hasNextPage);
      setIsLoading(false);
      setIsChangingTopic(false); // Reset topic change flag
    }

    getBlogs();
  }, [page, topic]);

  if (isLoading && (blogs.length === 0 || isChangingTopic)) {
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
            onClick={() => setPage((prev) => prev + 1)}
            disabled={isLoading}
          >
            {isLoading ? (
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
