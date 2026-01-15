'use client';
import { isActionError } from '@/types/ActionError';
import React from 'react';
import DarkManageCard from './DraftManageCard';
import { getDrafts } from '@/libs/api/drafts';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2, Clock } from 'lucide-react';

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const DraftList = ({ user }: { user: User }) => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['dashboardDrafts', user.email],
    queryFn: ({ pageParam }) => getDrafts(pageParam as number, 10),
    initialPageParam: 1,
    enabled: !!user.email,
    getNextPageParam: (lastPage) => {
      if (!lastPage || isActionError(lastPage)) return undefined;
      if (!lastPage.pagination.hasNextPage) return undefined;
      return lastPage.pagination.currentPage + 1;
    },
    retry: false,
  });

  const drafts =
    data?.pages.flatMap((page) => (isActionError(page) ? [] : page.drafts)) ||
    [];

  if (isLoading && drafts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-warning/10 rounded-full mb-4">
            <Loader2 className="h-8 w-8 text-warning animate-spin" />
          </div>
          <p className="text-base-content/60">Loading your drafts...</p>
        </div>
        <DraftSkeleton />
        <DraftSkeleton />
      </div>
    );
  }

  if (drafts.length === 0 && !isLoading) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-base-300 rounded-full mb-6">
        </div>
        <h3 className="text-xl font-semibold mb-2">No drafts yet</h3>
        <p className="text-base-content/60 max-w-md mx-auto">
          Your draft articles will appear here. Start writing and save your first draft to see it in this list.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Draft Articles</h2>
          <p className="text-base-content/60 text-sm mt-1">
            {drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'} in progress
          </p>
        </div>
        <div className="badge badge-warning badge-lg">
          {drafts.length} {drafts.length === 1 ? 'Draft' : 'Drafts'}
        </div>
      </div>

      <div className="grid gap-6">
        {drafts.map((draft) => (
          <DarkManageCard
            key={draft.id}
            id={draft.id}
            name={draft.name}
            createdAt={draft.createdAt}
            updatedAt={draft.updatedAt}
          />
        ))}
        {(isLoading || !user) && (
          <>
            <DraftSkeleton />
            <DraftSkeleton />
          </>
        )}
      </div>

      {hasNextPage && !isLoading && (
        <div className="flex justify-center pt-4">
          <button
            className="btn btn-warning btn-wide btn-lg gap-2"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Drafts'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const DraftSkeleton = () => {
  return (
    <article className="card card-side bg-base-100 border border-base-content/10 shadow-sm hover:shadow-md transition-shadow">
      <figure className="w-32 h-32 bg-base-300 rounded-s-xl flex items-center justify-center">
        <div className="skeleton w-12 h-12 rounded-full"></div>
      </figure>
      <div className="card-body p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="badge badge-ghost badge-sm">Draft</div>
          <div className="skeleton h-4 w-24"></div>
          <div className="skeleton h-4 w-16"></div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="skeleton h-6 w-3/4"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-2/3"></div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-base-content/40" />
            <div className="skeleton h-4 w-16"></div>
          </div>
        </div>

        <div className="card-actions">
          <div className="skeleton h-8 w-20"></div>
          <div className="skeleton h-8 w-20"></div>
        </div>
      </div>
    </article>
  );
};

export default DraftList;
