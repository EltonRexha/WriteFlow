'use client';
import {
  UserBlogsPagination,
  getUserBlogs,
} from '@/server-actions/blogs/action';
import React, { useEffect, useState } from 'react';
import { isActionError } from '@/types/ActionError';
import BlogPreviewCard from '../../../home/[topic]/_components/BlogPreviewCard';
import { User } from '@/app/generated/prisma';
import { getUser } from '@/server-actions/user/action';

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
  const [page, setPage] = useState(1);
  const [blogs, setBlogs] = useState<UserBlogsPagination['blogs']>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getBlogs() {
      setIsLoading(true);
      try {
        const response = await getUserBlogs(userEmail, page);

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
  }, [page, userEmail]);

  useEffect(() => {
    async function fetchUser() {
      const user = await getUser({ email: userEmail });

      setUser(user);
    }

    fetchUser();
  }, [userEmail]);

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
        {user &&
          blogs.map((blog) => (
            <BlogPreviewCard
              key={blog.id}
              {...blog}
              Author={{ name: user.name!, image: user.image }}
            />
          ))}
        {(isLoading || !user) && (
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
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserBlogsList;
