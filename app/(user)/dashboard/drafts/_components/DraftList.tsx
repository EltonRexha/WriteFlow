"use client";
import { isActionError } from "@/types/ActionError";
import React from "react";
import DarkManageCard from "./DraftManageCard";
import draftApi from "@/libs/api/services/drafts";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Edit3, Loader2, PenSquare } from "lucide-react";
import Link from "next/link";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const DraftList = ({ user }: { user: User }) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["dashboardDrafts", user.email],
      queryFn: ({ pageParam }) => draftApi.getDrafts(pageParam as number, 10),
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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="skeleton h-8 w-48 mb-2"></div>
            <div className="skeleton h-4 w-32"></div>
          </div>
          <div className="skeleton h-8 w-16 rounded-lg"></div>
        </div>
        <div className="grid gap-6">
          <DraftSkeleton />
          <DraftSkeleton />
        </div>
      </div>
    );
  }

  if (drafts.length === 0 && !isLoading) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-warning/10 rounded-full mb-6">
          <Edit3 className="h-10 w-10 text-warning" />
        </div>
        <h3 className="text-2xl font-bold mb-3">No Drafts Yet</h3>
        <p className="text-base-content/70 max-w-md mx-auto mb-8">
          Your draft articles will appear here. Start writing your ideas and
          save them as drafts to work on them later.
        </p>
        <div className="space-y-3 flex flex-col items-center">
          <Link href="/blog/new" className="btn btn-primary btn-lg">
            <PenSquare className="w-4 h-4 mr-2" />
            Start Writing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Draft Articles</h2>
          <p className="text-base-content/60 text-sm mt-1">
            {drafts.length} {drafts.length === 1 ? "draft" : "drafts"} in
            progress
          </p>
        </div>
        <div className="badge badge-warning badge-lg">
          {drafts.length} {drafts.length === 1 ? "Draft" : "Drafts"}
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
              "Load More Drafts"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const DraftSkeleton = () => {
  return (
    <article className="flex gap-6 py-6 border-b border-base-content/10 bg-base-200/50 p-4 rounded-lg max-w-3xl mx-auto w-full">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="skeleton h-5 w-12 rounded"></div>
          <div className="flex items-center gap-1">
            <div className="skeleton h-3 w-3"></div>
            <div className="skeleton h-3 w-16"></div>
          </div>
          <div className="flex items-center gap-1">
            <div className="skeleton h-3 w-3"></div>
            <div className="skeleton h-3 w-12"></div>
          </div>
        </div>

        <div className="mb-4">
          <div className="skeleton h-6 w-3/4 mb-2"></div>
          <div className="skeleton h-4 w-1/2"></div>
        </div>

        <div className="flex gap-2">
          <div className="skeleton h-8 w-16"></div>
        </div>
      </div>

      <div className="relative">
        <div className="skeleton w-8 h-8 rounded"></div>
      </div>
    </article>
  );
};

export default DraftList;
