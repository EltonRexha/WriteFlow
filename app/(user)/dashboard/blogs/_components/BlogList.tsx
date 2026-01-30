'use client';
import { isActionError } from '@/types/ActionError';
import React from 'react';
import BlogManageCard from './BlogManageCard';
import blogApi from '@/libs/api/services/blog';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FileText, Loader2, PenSquare } from 'lucide-react';
import Link from 'next/link';

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const BlogList = ({ user }: { user: User }) => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['dashboardUserBlogs'],
    queryFn: ({ pageParam }) => blogApi.getUserBlogs(user.email as string, pageParam as number),
    initialPageParam: 1,
    enabled: !!user.email,
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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="skeleton h-8 w-48 mb-2"></div>
            <div className="skeleton h-4 w-32"></div>
          </div>
          <div className="skeleton h-8 w-16 rounded-lg"></div>
        </div>
        <div className="grid gap-6">
          <BlogSkeleton />
          <BlogSkeleton />
        </div>
      </div>
    );
  }

  if (blogs.length === 0 && !isLoading) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
          <FileText className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-3">No Published Blogs Yet</h3>
        <p className="text-base-content/70 max-w-md mx-auto mb-8">
          Your published articles will appear here. Start sharing your thoughts with the world by publishing your first blog post.
        </p>
        <div className="space-y-3">
          <Link href="/blog/new" className="btn btn-primary btn-lg">
            <PenSquare className="w-4 h-4 mr-2" />
            Write Your First Blog
          </Link>
          <Link href="/drafts" className="btn btn-ghost">
            View Drafts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Published Articles</h2>
          <p className="text-base-content/60 text-sm mt-1">
            {blogs.length} {blogs.length === 1 ? 'article' : 'articles'} published
          </p>
        </div>
        <div className="badge badge-primary badge-lg">
          {blogs.length} {blogs.length === 1 ? 'Blog' : 'Blogs'}
        </div>
      </div>

      <div className="grid gap-6">
        {blogs.map((blog) => (
          <BlogManageCard
            key={blog.id}
            id={blog.id}
            title={blog.title}
            description={blog.description}
            imageUrl={blog.imageUrl}
            createdAt={new Date(blog.createdAt)}
            _count={blog._count}
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
        <div className="flex justify-center pt-4">
          <button
            className="btn btn-primary btn-wide btn-lg gap-2"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Articles'
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
          <div className="flex items-center gap-1">
            <div className="skeleton h-3 w-3"></div>
            <div className="skeleton h-3 w-16"></div>
          </div>
          <div className="flex items-center gap-1">
            <div className="skeleton h-3 w-3"></div>
            <div className="skeleton h-3 w-12"></div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="skeleton h-6 w-3/4"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-2/3"></div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="skeleton h-5 w-12"></div>
          <div className="skeleton h-5 w-12"></div>
        </div>

        <div className="flex gap-2">
          <div className="skeleton h-8 w-16"></div>
        </div>
      </div>

      <div className="relative">
        <div className="relative w-28 h-28 shrink-0">
          <div className="skeleton w-full h-full rounded-md"></div>
        </div>
        <div className="absolute -top-2 -right-2">
          <div className="skeleton w-8 h-8 rounded"></div>
        </div>
      </div>
    </article>
  );
};

export default BlogList;
