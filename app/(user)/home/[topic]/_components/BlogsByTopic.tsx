'use client';
import { getBlogsByTopic } from '@/server-actions/recommendation/action';
import React, { useEffect, useState } from 'react';
import BlogPreviewCard from './BlogPreviewCard';

type BlogsResponse = Awaited<ReturnType<typeof getBlogsByTopic>>;
type Blog = BlogsResponse['blogs'][number];

const BlogSkeleton = () => {
  return (
    <article className="flex gap-6 py-6 border-b border-base-content/10">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="skeleton w-6 h-6 rounded-full"></div>
          <div className="skeleton h-4 w-24"></div>
          <div className="skeleton h-4 w-16"></div>
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
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setBlogs([]);
    setPage(1);
    setHasNextPage(true);
  }, [topic]);

  useEffect(() => {
    async function getBlogs() {
      setIsLoading(true);
      try {
        const response = await getBlogsByTopic(topic, page);
        if (page === 1) {
          setBlogs(response.blogs);
        } else {
          setBlogs((prev) => [...prev, ...response.blogs]);
        }
        setHasNextPage(response.pagination.hasNextPage);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getBlogs();
  }, [page, topic]);

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
        {blogs.map((data) => (
          <BlogPreviewCard key={data.id} {...data} />
        ))}
        {isLoading && (
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
