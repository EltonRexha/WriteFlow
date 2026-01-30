'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useToggleDislikeBlog, useToggleLikeBlog } from '@/hooks/queries/blog';
import { isActionError } from '@/types/ActionError';
import ToggleDislikeBlogBtn from './ToggleDislikeBlogBtn';
import ToggleLikeBlogBtn from './ToggleLikeBlogBtn';

type ReactionStatus = 'none' | 'liked' | 'disliked';

type Snapshot = {
  status: ReactionStatus;
  likedCount: number;
  dislikedCount: number;
};

type ReactionState = {
  status: ReactionStatus;
  likedCount: number;
  dislikedCount: number;
};

const BlogReactions = ({
  blogId,
  initialIsLiked,
  initialIsDisliked,
  initialLikedCount,
  initialDislikedCount,
}: {
  blogId: string;
  initialIsLiked: boolean;
  initialIsDisliked: boolean;
  initialLikedCount: number;
  initialDislikedCount: number;
}) => {
  const [state, setState] = useState<ReactionState>(() => ({
    status: initialIsLiked ? 'liked' : initialIsDisliked ? 'disliked' : 'none',
    likedCount: initialLikedCount,
    dislikedCount: initialDislikedCount,
  }));

  const snapshotRef = useRef<Snapshot | null>(null);

  const likeMutation = useToggleLikeBlog();
  const dislikeMutation = useToggleDislikeBlog();

  const isBusy = likeMutation.isPending || dislikeMutation.isPending;

  const applyLikeOptimistic = useCallback(() => {
    snapshotRef.current = {
      status: state.status,
      likedCount: state.likedCount,
      dislikedCount: state.dislikedCount,
    };

    setState((prev) => {
      if (prev.status === 'liked') {
        return {
          status: 'none',
          likedCount: Math.max(0, prev.likedCount - 1),
          dislikedCount: prev.dislikedCount,
        };
      }

      if (prev.status === 'disliked') {
        return {
          status: 'liked',
          likedCount: prev.likedCount + 1,
          dislikedCount: Math.max(0, prev.dislikedCount - 1),
        };
      }

      return {
        status: 'liked',
        likedCount: prev.likedCount + 1,
        dislikedCount: prev.dislikedCount,
      };
    });
  }, [state.dislikedCount, state.likedCount, state.status]);

  const applyDislikeOptimistic = useCallback(() => {
    snapshotRef.current = {
      status: state.status,
      likedCount: state.likedCount,
      dislikedCount: state.dislikedCount,
    };

    setState((prev) => {
      if (prev.status === 'disliked') {
        return {
          status: 'none',
          likedCount: prev.likedCount,
          dislikedCount: Math.max(0, prev.dislikedCount - 1),
        };
      }

      if (prev.status === 'liked') {
        return {
          status: 'disliked',
          likedCount: Math.max(0, prev.likedCount - 1),
          dislikedCount: prev.dislikedCount + 1,
        };
      }

      return {
        status: 'disliked',
        likedCount: prev.likedCount,
        dislikedCount: prev.dislikedCount + 1,
      };
    });
  }, [state.dislikedCount, state.likedCount, state.status]);

  const rollback = useCallback(() => {
    if (!snapshotRef.current) return;
    const snap = snapshotRef.current;
    setState({
      status: snap.status,
      likedCount: snap.likedCount,
      dislikedCount: snap.dislikedCount,
    });
    snapshotRef.current = null;
  }, []);

  const commit = useCallback(() => {
    snapshotRef.current = null;
  }, []);

  const handleLike = useCallback(() => {
    if (isBusy) return;
    applyLikeOptimistic();
    likeMutation.mutate(blogId, {
      onError: rollback,
      onSuccess: (res) => {
        if (res && isActionError(res)) {
          rollback();
          return;
        }
        commit();
      },
    });
  }, [applyLikeOptimistic, blogId, commit, isBusy, likeMutation, rollback]);

  const handleDislike = useCallback(() => {
    if (isBusy) return;
    applyDislikeOptimistic();
    dislikeMutation.mutate(blogId, {
      onError: rollback,
      onSuccess: (res) => {
        if (res && isActionError(res)) {
          rollback();
          return;
        }
        commit();
      },
    });
  }, [applyDislikeOptimistic, blogId, commit, dislikeMutation, isBusy, rollback]);

  useEffect(() => {
    setState({
      status: initialIsLiked ? 'liked' : initialIsDisliked ? 'disliked' : 'none',
      likedCount: initialLikedCount,
      dislikedCount: initialDislikedCount,
    });
  }, [
    initialDislikedCount,
    initialIsDisliked,
    initialIsLiked,
    initialLikedCount,
  ]);

  return (
    <div className="flex space-x-2 items-center">
      <div className="flex items-center gap-1">
        <ToggleLikeBlogBtn
          blogId={blogId}
          isLiked={state.status === 'liked'}
          onClick={handleLike}
          disabled={isBusy}
        />
        <p className="text-sm text-base-content/70">{state.likedCount}</p>
      </div>
      <div className="flex items-center gap-1">
        <ToggleDislikeBlogBtn
          blogId={blogId}
          isDisliked={state.status === 'disliked'}
          onClick={handleDislike}
          disabled={isBusy}
        />
        <p className="text-sm text-base-content/70">{state.dislikedCount}</p>
      </div>
    </div>
  );
};

export default BlogReactions;
