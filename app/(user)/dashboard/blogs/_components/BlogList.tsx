'use client';
import {
  getUserBlogs,
  UserBlogsPagination,
} from '@/server-actions/blogs/action';
import { isActionError } from '@/types/ActionError';
import React, { useEffect, useState } from 'react';
import BlogManageCard from './BlogManageCard';

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const BlogList = ({ user }: { user: User }) => {
  const [page, setPage] = useState(1);
  const [blogs, setBlogs] = useState<UserBlogsPagination['blogs']>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getBlogs() {
      setIsLoading(true);
      try {
        if (!user.email) {
          return;
        }
        const response = await getUserBlogs(user.email, page);

        if (isActionError(response)) {
          return;
        }

        if (page === 1) {
          setBlogs(response.blogs);
        } else {
          setBlogs((prev) => [...prev, ...response.blogs]);
        }
        setHasNextPage(response.pagination.hasNextPage);
      } catch (error) {
        console.error('Error fetching user blogs:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getBlogs();
  }, [user, page]);

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
          <BlogManageCard
            key={blog.id}
            {...blog}
            Author={{ name: user.name!, image: user.image! }}
          />
        ))}
        {(isLoading || !user) && (
          <>
            <BlogSkeleton />
            <BlogSkeleton />
          </>
        )}
      </div>
      {hasNextPage && !isLoading && (
        <div className="flex justify-center">
          <button
            className="btn btn-secondary btn-dash btn-sm w-max"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={isLoading}
          >
            {isLoading ? (
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

const BlogSkeleton = () => {
  return (
    <article className="flex gap-6 py-6 border-b border-base-content/10 bg-base-200/50 p-4 rounded-lg max-w-3xl mx-auto w-full">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="skeleton w-6 h-6 rounded-full"></div>
          <div className="skeleton h-4 w-24"></div>
          <div className="skeleton h-4 w-16 hidden sm:block"></div>
          <div className="skeleton h-4 w-16 hidden sm:block"></div>
        </div>

        <div className="space-y-2">
          <div className="skeleton h-7 w-3/4"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-2/3"></div>
        </div>

        <div className="flex items-center gap-4 mt-4 mb-4">
          <div className="skeleton h-5 w-12"></div>
          <div className="skeleton h-5 w-12"></div>
        </div>

        <div>
          <div className="skeleton h-8 w-16"></div>
        </div>
      </div>

      <div className="relative">
        <div className="skeleton w-28 h-28 rounded-md"></div>
        <div className="absolute -top-2 -right-2 w-8 h-8 skeleton rounded-lg"></div>
      </div>
    </article>
  );
};

export default BlogList;
